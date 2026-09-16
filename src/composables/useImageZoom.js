import { computed, ref } from 'vue';

const MIN_SCALE = 1;
const MAX_SCALE = 6;
const DOUBLE_CLICK_SCALE = 2.5;
const WHEEL_FACTOR = 0.0018;

/**
 * Cursor-anchored zoom and pan for an image inside a fixed viewport.
 * Assumes the transform is applied with `transform-origin: center center`
 * on content centered in the viewport.
 *
 * @param {{
 *   viewportRef: import('vue').Ref<HTMLElement | null>
 * }} options
 */
export function useImageZoom({ viewportRef }) {
  const scale = ref(MIN_SCALE);
  const offsetX = ref(0);
  const offsetY = ref(0);
  const isPanning = ref(false);

  /** @type {Map<number, { x: number, y: number }>} */
  const activePointers = new Map();

  /** @type {{ x: number, y: number } | null} */
  let panLast = null;
  /** @type {number | null} */
  let pinchDistance = null;

  const isZoomed = computed(() => scale.value > MIN_SCALE + 0.001);

  const imageStyle = computed(() => ({
    transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`,
    transformOrigin: 'center center',
    transition: isPanning.value ? 'none' : 'transform 0.15s ease-out'
  }));

  /**
   * @param {number} value
   * @param {number} min
   * @param {number} max
   */
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function clampOffsets() {
    if (scale.value <= MIN_SCALE) {
      offsetX.value = 0;
      offsetY.value = 0;
      return;
    }

    const viewport = viewportRef.value;
    if (!viewport) {
      return;
    }

    const maxX = (viewport.clientWidth * (scale.value - 1)) / 2 + viewport.clientWidth * 0.25;
    const maxY = (viewport.clientHeight * (scale.value - 1)) / 2 + viewport.clientHeight * 0.25;
    offsetX.value = clamp(offsetX.value, -maxX, maxX);
    offsetY.value = clamp(offsetY.value, -maxY, maxY);
  }

  /**
   * @param {number} nextScale
   * @param {number} pointerX viewport-local x
   * @param {number} pointerY viewport-local y
   */
  function zoomTo(nextScale, pointerX, pointerY) {
    const viewport = viewportRef.value;
    const clamped = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    if (!viewport || clamped === scale.value) {
      if (clamped <= MIN_SCALE) {
        offsetX.value = 0;
        offsetY.value = 0;
      }
      return;
    }

    const cx = viewport.clientWidth / 2;
    const cy = viewport.clientHeight / 2;
    const relX = pointerX - cx;
    const relY = pointerY - cy;
    const ratio = clamped / scale.value;

    // Keep the point under the pointer fixed (origin = viewport center).
    offsetX.value = relX - (relX - offsetX.value) * ratio;
    offsetY.value = relY - (relY - offsetY.value) * ratio;
    scale.value = clamped;

    if (scale.value <= MIN_SCALE) {
      offsetX.value = 0;
      offsetY.value = 0;
    } else {
      clampOffsets();
    }
  }

  /**
   * @param {number} clientX
   * @param {number} clientY
   */
  function toLocal(clientX, clientY) {
    const viewport = viewportRef.value;
    if (!viewport) {
      return { x: 0, y: 0 };
    }
    const rect = viewport.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function reset() {
    scale.value = MIN_SCALE;
    offsetX.value = 0;
    offsetY.value = 0;
    isPanning.value = false;
    activePointers.clear();
    panLast = null;
    pinchDistance = null;
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  function panBy(dx, dy) {
    if (!isZoomed.value) {
      return;
    }
    offsetX.value += dx;
    offsetY.value += dy;
    clampOffsets();
  }

  /**
   * @param {WheelEvent} event
   */
  function onWheel(event) {
    event.preventDefault();
    const { x, y } = toLocal(event.clientX, event.clientY);
    const next = scale.value * (1 + -event.deltaY * WHEEL_FACTOR);
    zoomTo(next, x, y);
  }

  /**
   * @param {PointerEvent} event
   */
  function onPointerDown(event) {
    if (event.button !== 0 && event.pointerType === 'mouse') {
      return;
    }

    viewportRef.value?.setPointerCapture?.(event.pointerId);
    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (activePointers.size === 1) {
      if (isZoomed.value) {
        isPanning.value = true;
        panLast = { x: event.clientX, y: event.clientY };
      }
    } else if (activePointers.size === 2) {
      isPanning.value = true;
      panLast = null;
      const points = [...activePointers.values()];
      pinchDistance = Math.hypot(
        points[0].x - points[1].x,
        points[0].y - points[1].y
      );
    }
  }

  /**
   * @param {PointerEvent} event
   */
  function onPointerMove(event) {
    if (!activePointers.has(event.pointerId)) {
      return;
    }

    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (activePointers.size === 2 && pinchDistance != null) {
      const points = [...activePointers.values()];
      const distance = Math.hypot(
        points[0].x - points[1].x,
        points[0].y - points[1].y
      );
      if (distance > 0 && pinchDistance > 0) {
        const midX = (points[0].x + points[1].x) / 2;
        const midY = (points[0].y + points[1].y) / 2;
        const { x, y } = toLocal(midX, midY);
        const next = scale.value * (distance / pinchDistance);
        pinchDistance = distance;
        zoomTo(next, x, y);
      }
      return;
    }

    if (activePointers.size === 1 && isPanning.value && panLast && isZoomed.value) {
      const dx = event.clientX - panLast.x;
      const dy = event.clientY - panLast.y;
      panLast = { x: event.clientX, y: event.clientY };
      panBy(dx, dy);
    }
  }

  /**
   * @param {PointerEvent} event
   */
  function onPointerUp(event) {
    activePointers.delete(event.pointerId);

    try {
      viewportRef.value?.releasePointerCapture?.(event.pointerId);
    } catch {
      // Capture may already be released.
    }

    if (activePointers.size < 2) {
      pinchDistance = null;
    }

    if (activePointers.size === 1) {
      const remaining = [...activePointers.values()][0];
      panLast = remaining ? { x: remaining.x, y: remaining.y } : null;
      isPanning.value = isZoomed.value;
    } else if (activePointers.size === 0) {
      isPanning.value = false;
      panLast = null;
    }
  }

  /**
   * @param {MouseEvent} event
   */
  function onDoubleClick(event) {
    event.preventDefault();
    const { x, y } = toLocal(event.clientX, event.clientY);
    if (isZoomed.value) {
      zoomTo(MIN_SCALE, x, y);
    } else {
      zoomTo(DOUBLE_CLICK_SCALE, x, y);
    }
  }

  return {
    scale,
    offsetX,
    offsetY,
    isPanning,
    isZoomed,
    imageStyle,
    reset,
    panBy,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onDoubleClick
  };
}

export const ZOOM_PAN_STEP = 48;
