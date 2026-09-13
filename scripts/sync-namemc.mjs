/**
 * Standalone utility to fetch UUIDs and Locator Bar Colors from NameMC
 * for all usernames defined in src/data/whitelist.json.
 *
 * Run with: node scripts/sync-namemc.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const whitelistPath = join(rootDir, 'whitelist.json');
const servicePath = join(rootDir, 'src/services/playerService.js');

const whitelist = JSON.parse(readFileSync(whitelistPath, 'utf-8'));
console.log(`Found ${whitelist.length} players in whitelist.json`);

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const results = {};

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
      console.log(`  -> Unregistered or custom username`);
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
      results[username] = { uuid: uuidMatch, locatorColor: colorMatch };
    }
  } catch (err) {
    console.error(`  -> Failed to check ${username}:`, err.message);
  }
}

console.log('Finished querying NameMC. Results:', results);
