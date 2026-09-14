/**
 * Service to resolve player Minecraft UUIDs, skins, and NameMC locator-bar colors.
 */

// NameMC profile data, kept in sync via `npm run sync-namemc` (scripts/sync-namemc.mjs).
import NAMEMC_DATABASE from '../data/namemc-cache.json';

const playerCache = new Map();

/**
 * Deterministic hash algorithm for string/username.
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Generates an HSV-based hex color matching NameMC's locator-bar palette:
 * - V (brightness) = 230 / 255 (~0.90) so max channel is 0xE6
 * - S (saturation) = 0.55 - 0.95
 * - H (hue) = 0 - 360 degrees
 */
export function generateNameMCColor(seedString) {
  const hash = hashString(seedString);
  const hue = (hash % 3600) / 10;
  const saturation = 0.55 + ((hash >> 8) % 40) / 100;
  const value = 230 / 255; // 0.90196

  // HSV to RGB conversion
  const c = value * saturation;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = value - c;

  let r = 0, g = 0, b = 0;
  if (hue < 60) {
    r = c; g = x; b = 0;
  } else if (hue < 120) {
    r = x; g = c; b = 0;
  } else if (hue < 180) {
    r = 0; g = c; b = x;
  } else if (hue < 240) {
    r = 0; g = x; b = c;
  } else if (hue < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  const toHex = (n) => {
    const hex = Math.round((n + m) * 255).toString(16).toUpperCase();
    return hex.padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Returns immediate synchronous defaults for player data while async lookup occurs.
 */
export function getInitialPlayerData(username) {
  if (playerCache.has(username)) {
    return playerCache.get(username);
  }

  const known = NAMEMC_DATABASE[username];
  const initial = {
    username,
    uuid: known?.uuid || null,
    locatorColor: known?.locatorColor || generateNameMCColor(username),
    skinUrl: `https://mc-heads.net/skin/${encodeURIComponent(username)}`,
    namemcUrl: `https://namemc.com/profile/${encodeURIComponent(username)}`,
    loaded: Boolean(known)
  };

  playerCache.set(username, initial);
  return initial;
}

/**
 * Asynchronously resolves player UUID and ensures locator color is accurate.
 */
export async function resolvePlayerData(username) {
  const existing = getInitialPlayerData(username);
  if (existing.loaded && existing.uuid) {
    return existing;
  }

  try {
    // Attempt to query PlayerDB (open-CORS free Minecraft API)
    const res = await fetch(`https://playerdb.co/api/player/minecraft/${encodeURIComponent(username)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.code === 'player.found' && data.data?.player) {
        const player = data.data.player;
        const resolved = {
          ...existing,
          uuid: player.id,
          skinUrl: player.skin_texture || existing.skinUrl,
          locatorColor: existing.locatorColor || generateNameMCColor(player.id || username),
          loaded: true
        };
        playerCache.set(username, resolved);
        return resolved;
      }
    }
  } catch (err) {
    console.warn(`Could not fetch live player data for ${username}:`, err);
  }

  // Mark as loaded with current values
  existing.loaded = true;
  return existing;
}
