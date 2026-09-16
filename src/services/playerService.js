/**
 * Service to build player display data and Vanilla Java locator-bar colors.
 *
 * Locator colors match Minecraft Java Edition: UUID.hashCode() low 24 bits as
 * RGB, then HSV brightness pinned to 0.9 (230/255).
 */

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

const CORS_PROXY = 'http://lottuce.moe:6767/';

/**
 * Fetches the skin URL for a given UUID.
 */
function fetchSkinUrl(uuid) {
  const id = String(uuid).replace(/-/g, '');
  const skinDataUrl = `https://sessionserver.mojang.com/session/minecraft/profile/${encodeURIComponent(id)}`;
  return fetch(`${CORS_PROXY}${skinDataUrl}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch skin URL for UUID: ${uuid}`);
      }
      return response.json();
    })
    .then((data) => {
      const texturesProp = data.properties?.find((p) => p.name === 'textures');
      if (!texturesProp?.value) {
        throw new Error(`No skin found for UUID: ${uuid}`);
      }
      const decoded = JSON.parse(atob(texturesProp.value));
      const url = decoded.textures?.SKIN?.url;
      if (!url) {
        throw new Error(`No skin found for UUID: ${uuid}`);
      }
      return url;
    });
}

/**
 * Vanilla Java Edition locator-bar color for a player UUID.
 * Falls back to white when no valid UUID is available.
 */
export function generateVanillaLocatorColor(uuid) {
  if (!UUID_PATTERN.test(uuid ?? '')) return '#FFFFFF';

  const hash = javaUuidHashCode(uuid);
  const r = (hash >> 16) & 0xff;
  const g = (hash >> 8) & 0xff;
  const b = hash & 0xff;

  const [h, s] = javaRgbToHsb(r, g, b);
  const [nr, ng, nb] = javaHsbToRgb(h, s, 0.9);
  const toHex = (n) => n.toString(16).toUpperCase().padStart(2, '0');
  return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
}

/**
 * Builds display data for a whitelist entry that already includes a UUID.
 */
export async function createPlayer({ name, uuid }) {
  return {
    username: name,
    uuid,
    locatorColor: generateVanillaLocatorColor(uuid),
    skinUrl: await fetchSkinUrl(uuid).catch(() => ''),
    namemcUrl: `https://namemc.com/profile/${encodeURIComponent(uuid)}`
  };
}
