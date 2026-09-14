/**
 * Utility to fetch UUIDs and Locator Bar Colors from NameMC for all usernames
 * defined in whitelist.json, and persist them to src/data/namemc-cache.json.
 *
 * playerService.js reads that cache file at build/run time, so simply running
 * this script and committing the resulting diff is enough to update the site.
 *
 * Run with: npm run sync-namemc
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const whitelistPath = join(rootDir, 'whitelist.json');
const cachePath = join(rootDir, 'src/data/namemc-cache.json');

const whitelist = JSON.parse(readFileSync(whitelistPath, 'utf-8'));
console.log(`Found ${whitelist.length} players in whitelist.json`);

let cache = {};
try {
  cache = JSON.parse(readFileSync(cachePath, 'utf-8'));
} catch {
  console.log('No existing cache file found, starting fresh.');
}

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

let updatedCount = 0;
let failedCount = 0;

for (const entry of whitelist) {
  const username = typeof entry === 'string' ? entry : entry.username;
  console.log(`Checking NameMC for ${username}...`);
  try {
    const proc = spawnSync(EDGE_PATH, [
      '--headless=new',
      '--disable-blink-features=AutomationControlled',
      `--user-agent=${UA}`,
      '--dump-dom',
      `https://namemc.com/profile/${encodeURIComponent(username)}`
    ], { encoding: 'utf-8', timeout: 15000 });

    const html = proc.stdout || '';
    if (!html.includes('Minecraft Profile')) {
      console.log(`  -> Unregistered, custom username, or blocked request. Keeping existing cache entry.`);
      failedCount++;
      continue;
    }

    // Extract UUID
    const clipboards = [...html.matchAll(/data-clipboard-text="([^"]+)"/g)].map(m => m[1]);
    const uuidMatch = clipboards.find(c => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(c));

    // Extract Locator Bar Color
    let colorMatch = null;
    const locatorIdx = html.indexOf('Locator Bar Color');
    if (locatorIdx !== -1) {
      const snippet = html.slice(locatorIdx, locatorIdx + 350);
      const col = snippet.match(/#(?:[0-9a-fA-F]{6})/);
      if (col) colorMatch = col[0];
    }

    if (uuidMatch && colorMatch) {
      console.log(`  -> UUID: ${uuidMatch}, LocatorColor: ${colorMatch}`);
      cache[username] = { uuid: uuidMatch, locatorColor: colorMatch };
      updatedCount++;
    } else {
      console.log(`  -> Could not extract UUID/LocatorColor. Keeping existing cache entry.`);
      failedCount++;
    }
  } catch (err) {
    console.error(`  -> Failed to check ${username}:`, err.message);
    failedCount++;
  }
}

writeFileSync(cachePath, JSON.stringify(cache, null, 2) + '\n', 'utf-8');
console.log(`\nSaved ${cachePath}`);
console.log(`Updated ${updatedCount} player(s), ${failedCount} failed/skipped.`);
