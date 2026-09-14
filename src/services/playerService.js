/**
 * Service to resolve player Minecraft UUIDs, skins, and locator-bar colors.
 *
 * Locator colors match Java Edition / NameMC: UUID.hashCode() low 24 bits as
 * RGB, then HSV brightness pinned to 0.9 (230/255).
 */

const playerCache = new Map();

/**
 * Java's UUID.hashCode(): fold most/least significant bits into a 32-bit int.
 */
function javaUuidHashCode(uuid) {
  const hex = uuid.replace(/-/g, '');
  const msbHi = parseInt(hex.slice(0, 8), 16) | 0;
  const msbLo = parseInt(hex.slice(8, 16), 16) | 0;
  const lsbHi = parseInt(hex.slice(16, 24), 16) | 0;
  const lsbLo = parseInt(hex.slice(24, 32), 16) | 0;
  return (msbHi ^ lsbHi ^ msbLo ^ lsbLo) | 0;
}

/** Same math as java.awt.Color.RGBtoHSB. */
function javaRgbToHsb(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const brightness = max / 255;
  const s = max === 0 ? 0 : (max - min) / max;
  let h = 0;
  if (s !== 0) {
    const delta = max - min;
    if (r === max) h = (g - b) / delta;
    else if (g === max) h = 2 + (b - r) / delta;
    else h = 4 + (r - g) / delta;
    h /= 6;
    if (h < 0) h += 1;
  }
  return [h, s, brightness];
}

/** Same math as java.awt.Color.HSBtoRGB. */
function javaHsbToRgb(h, s, brightness) {
  let r = 0;
  let g = 0;
  let b = 0;
  if (s === 0) {
    r = g = b = Math.floor(brightness * 255 + 0.5);
  } else {
    const h6 = (h - Math.floor(h)) * 6;
    const f = h6 - Math.floor(h6);
    const p = brightness * (1 - s);
    const q = brightness * (1 - s * f);
    const t = brightness * (1 - s * (1 - f));
    switch (Math.floor(h6)) {
      case 0:
        r = brightness; g = t; b = p;
        break;
      case 1:
        r = q; g = brightness; b = p;
        break;
      case 2:
        r = p; g = brightness; b = t;
        break;
      case 3:
        r = p; g = q; b = brightness;
        break;
      case 4:
        r = t; g = p; b = brightness;
        break;
      case 5:
        r = brightness; g = p; b = q;
        break;
    }
    r = Math.floor(r * 255 + 0.5);
    g = Math.floor(g * 255 + 0.5);
    b = Math.floor(b * 255 + 0.5);
  }
  return [r, g, b];
}

/**
 * Locator-bar color for a Java Edition UUID (NameMC / vanilla).
 * Falls back to a stable username-derived tint when no UUID is available yet.
 */
export function generateNameMCColor(seedString) {
  const looksLikeUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(seedString);
  let r;
  let g;
  let b;
  if (looksLikeUuid) {
    const hash = javaUuidHashCode(seedString);
    r = (hash >> 16) & 0xff;
    g = (hash >> 8) & 0xff;
    b = hash & 0xff;
  } else {
    // Temporary stand-in until UUID resolves; not NameMC-accurate.
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = (hash << 5) - hash + seedString.charCodeAt(i);
      hash |= 0;
    }
    hash = Math.abs(hash);
    r = (hash >> 16) & 0xff;
    g = (hash >> 8) & 0xff;
    b = hash & 0xff;
  }

  const [h, s] = javaRgbToHsb(r, g, b);
  const [nr, ng, nb] = javaHsbToRgb(h, s, 0.9);
  const toHex = (n) => n.toString(16).toUpperCase().padStart(2, '0');
  return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
}

/**
 * Returns immediate synchronous defaults for player data while async lookup occurs.
 */
export function getInitialPlayerData(username) {
  if (playerCache.has(username)) {
    return playerCache.get(username);
  }

  const initial = {
    username,
    uuid: null,
    locatorColor: generateNameMCColor(username),
    skinUrl: `https://mc-heads.net/skin/${encodeURIComponent(username)}`,
    namemcUrl: `https://namemc.com/profile/${encodeURIComponent(username)}`,
    loaded: false
  };

  playerCache.set(username, initial);
  return initial;
}

/**
 * Asynchronously resolves player UUID and recomputes the accurate locator color.
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
        const uuid = player.id;
        const resolved = {
          ...existing,
          uuid,
          skinUrl: player.skin_texture || existing.skinUrl,
          locatorColor: uuid ? generateNameMCColor(uuid) : existing.locatorColor,
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
