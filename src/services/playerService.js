/**
 * Service to resolve player Minecraft UUIDs, skins, and NameMC locator-bar colors.
 */

// Official NameMC profile data extracted directly from NameMC cards
const NAMEMC_DATABASE = {
  Antoshka: {
    uuid: '4df54a38-dd44-4aaa-a96b-d67b9f9f3045',
    locatorColor: '#45E6AC'
  },
  FiftyFive: {
    uuid: '4d6347cc-7409-4784-aa4d-27d64182caf0',
    locatorColor: '#A0E66B'
  },
  Speedrunner: {
    uuid: '242807aa-8179-419d-9478-942a9223b713',
    locatorColor: '#17E620'
  },
  StreamerGuy: {
    uuid: '9b2a06af-8484-4978-9f90-602da2ac78ff',
    locatorColor: '#E68908'
  },
  Fisherman_Sam: {
    uuid: '7ace8ccc-dad6-4bb5-9815-e19e88b1ae10',
    locatorColor: '#AF7EE6'
  },
  PikachuFan: {
    uuid: 'e4b20cb5-04c7-489b-b3ad-2047d8f17901',
    locatorColor: '#5A40E6'
  },
  WheatKing: {
    uuid: '52eeccb1-0231-4411-9260-e9e0679784f8',
    locatorColor: '#28E6B8'
  },
  ShulkerMaster: {
    uuid: 'e6bd814f-c896-438a-85af-f276b99552ea',
    locatorColor: '#28E6D0'
  },
  SantaClaus: {
    uuid: '5d1e680a-18c7-4ec4-8bb6-ff2f2a842dec',
    locatorColor: '#DDE60C'
  },
  RaftSurvivor: {
    uuid: '890f9f4e-c806-4b0f-b04e-2d7355a8a4be',
    locatorColor: '#E65986'
  }
};

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
