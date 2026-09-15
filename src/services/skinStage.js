/**
 * Shared skinview3d stage for the players grid.
 *
 * One SkinViewer means one WebGL context, and browsers keep only ~16 alive
 * before evicting the oldest, so a viewer per card cannot scale with the
 * whitelist. This module holds a single context instead: it rasterises a poster
 * image for every card once, and lends the live canvas to whichever card the
 * pointer is currently over.
 */
const STAGE_WIDTH = 240;
const STAGE_HEIGHT = 290;
const FALLBACK_SKIN = 'https://mc-heads.net/skin/MHF_Steve';

// The model is 16 pixels per block, so rendering at full retina density costs
// several times the fill rate for no visible gain at card size.
const MAX_PIXEL_RATIO = 1.5;

let viewer = null;
let viewerPending = null;
let cardCount = 0;

let lentToken = null;
let lentHandlers = null;

const jobQueue = [];
let runningJob = null;

/** @type {Map<string, Promise<HTMLImageElement>>} */
const skinImages = new Map();
/** @type {Map<string, Promise<string | null>>} */
const posters = new Map();

function ensureViewer() {
  if (viewer) return Promise.resolve(viewer);
  if (!viewerPending) {
    // three.js is the bulk of this route's bundle; deferring it lets the page
    // shell paint before the renderer is downloaded and parsed.
    viewerPending = import('skinview3d').then(({ SkinViewer }) => createViewer(SkinViewer));
  }
  return viewerPending;
}

function createViewer(SkinViewer) {
  if (viewer) return viewer;

  const canvas = document.createElement('canvas');
  viewer = new SkinViewer({
    canvas,
    width: STAGE_WIDTH,
    height: STAGE_HEIGHT,
    pixelRatio: Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO),
    // Posters are captured with toBlob() after the draw call has returned.
    preserveDrawingBuffer: true,
    // Nothing is animated; every frame is driven by an explicit render() call.
    renderPaused: true,
    enableControls: true
  });

  viewer.background = null;
  viewer.fov = 48;

  // Wheel zoom over a card would swallow page scrolling.
  viewer.controls.enableZoom = false;
  viewer.controls.enablePan = false;

  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  canvas.style.objectFit = 'contain';
  canvas.style.cursor = 'grab';
  canvas.style.touchAction = 'none';

  viewer.controls.addEventListener('change', () => {
    if (viewer && !viewer.disposed) viewer.render();
  });
  viewer.controls.addEventListener('start', () => lentHandlers?.onRotateStart?.());
  viewer.controls.addEventListener('end', () => lentHandlers?.onRotateEnd?.());

  return viewer;
}

function applyIsometricPose(stage) {
  stage.controls.target.set(0, 2, 0);
  stage.camera.position.set(21, 5, 43);
  stage.controls.update();

  const skin = stage.playerObject.skin;
  if (skin) {
    skin.leftArm.rotation.x = -0.15;
    skin.rightArm.rotation.x = 0.15;
    skin.leftLeg.rotation.x = 0.12;
    skin.rightLeg.rotation.x = -0.12;
    skin.head.rotation.y = -0.2;
    skin.head.rotation.x = 0.08;
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    // Required so the rendered frame stays readable by toBlob().
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load skin texture: ${url}`));
    image.src = url;
  });
}

async function resolveSkinImage(skinUrl, username) {
  const candidates = [
    skinUrl,
    username ? `https://minotar.net/skin/${encodeURIComponent(username)}` : null,
    FALLBACK_SKIN
  ].filter(Boolean);

  for (const url of candidates) {
    let pending = skinImages.get(url);
    if (!pending) {
      pending = loadImage(url);
      skinImages.set(url, pending);
    }
    try {
      return await pending;
    } catch {
      skinImages.delete(url);
    }
  }

  return null;
}

/**
 * Jobs get exclusive use of the single framebuffer. Lending the stage out
 * suspends the queue so a poster render can never overwrite the frame a card is
 * currently displaying.
 */
function enqueue(job) {
  return new Promise((resolve, reject) => {
    jobQueue.push({ job, resolve, reject });
    pump();
  });
}

function pump() {
  if (runningJob || lentToken !== null || jobQueue.length === 0) return;

  const { job, resolve, reject } = jobQueue.shift();
  runningJob = Promise.resolve()
    .then(job)
    .then(resolve, reject)
    .finally(() => {
      runningJob = null;
      pump();
    });
}

function captureFrame(stage) {
  return new Promise((resolve) => {
    stage.canvas.toBlob(
      (blob) => resolve(blob ? URL.createObjectURL(blob) : null),
      'image/png'
    );
  });
}

/**
 * Renders a still image of a skin in the canonical pose and returns an object
 * URL for it. Repeated calls for the same texture share one result.
 */
export function renderPoster(skinUrl, username) {
  const cached = posters.get(skinUrl);
  if (cached) return cached;

  // The texture download happens outside the queue so a slow CDN cannot block
  // a card that wants the live stage.
  const pending = resolveSkinImage(skinUrl, username)
    .then((image) => {
      if (!image) return null;
      return enqueue(async () => {
        const stage = await ensureViewer();
        if (stage.disposed) return null;
        stage.loadSkin(image);
        applyIsometricPose(stage);
        stage.render();
        return captureFrame(stage);
      });
    })
    .catch(() => null);

  posters.set(skinUrl, pending);
  return pending;
}

/**
 * Moves the live canvas into `container`. Returns a token identifying the loan,
 * or null if another card claimed the stage first.
 */
export async function lendStageTo(container, { skinUrl, username, onRotateStart, onRotateEnd, onEvict } = {}) {
  // Evict the previous holder so it can fall back to its poster before we
  // reassign the shared canvas. Detach the canvas now so it does not sit on
  // top of the old card during the upcoming texture download.
  if (lentToken !== null) {
    const prevHandlers = lentHandlers;
    lentToken = null;
    lentHandlers = null;
    if (viewer) viewer.canvas.remove();
    prevHandlers?.onEvict?.();
  }

  const token = Symbol('skin-stage');
  lentToken = token;
  lentHandlers = { onRotateStart, onRotateEnd, onEvict };

  if (runningJob) {
    await runningJob.catch(() => {});
  }
  if (lentToken !== token) return null;

  const [image, stage] = await Promise.all([
    resolveSkinImage(skinUrl, username),
    ensureViewer()
  ]);
  if (lentToken !== token || stage.disposed) return null;

  if (image) stage.loadSkin(image);
  applyIsometricPose(stage);
  container.appendChild(stage.canvas);
  stage.render();

  return token;
}

/**
 * Hands the canvas back. The card falls back to its poster, which always holds
 * the canonical pose, so any rotation the user applied is discarded.
 */
export function returnStage(token) {
  if (lentToken !== token || !viewer) return;

  lentToken = null;
  lentHandlers = null;
  viewer.canvas.remove();
  pump();
}

export function resetLentPose(token) {
  if (lentToken !== token || !viewer) return;
  applyIsometricPose(viewer);
  viewer.render();
}

export function retainStage() {
  cardCount += 1;
}

export function releaseStage() {
  cardCount = Math.max(0, cardCount - 1);
  if (cardCount > 0) return;

  jobQueue.length = 0;
  lentToken = null;
  lentHandlers = null;

  if (viewer) {
    viewer.canvas.remove();
    viewer.dispose();
    viewer = null;
  }
  viewerPending = null;

  for (const pending of posters.values()) {
    Promise.resolve(pending).then((url) => {
      if (url) URL.revokeObjectURL(url);
    });
  }
  posters.clear();
  skinImages.clear();
}
