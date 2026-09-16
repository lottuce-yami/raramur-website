<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useImageZoom, ZOOM_PAN_STEP } from '@/composables/useImageZoom.js';

const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['close', 'update:index']);

const stageRef = ref(/** @type {HTMLElement | null} */ (null));
const viewportRef = ref(/** @type {HTMLElement | null} */ (null));
const activeThumbRefs = ref(/** @type {Record<number, HTMLElement | null>} */ ({}));

const {
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
} = useImageZoom({ viewportRef });

const canNavigate = computed(() => props.images.length > 1);
const activeImage = computed(() => props.images[props.index] ?? null);
const counterLabel = computed(() => `${props.index + 1} / ${props.images.length}`);

/** @type {string} */
let previousOverflow = '';
/** @type {Element | null} */
let previouslyFocused = null;
/** @type {{ x: number, y: number } | null} */
let backdropPointerStart = null;
let backdropMoved = false;

const viewportCursor = computed(() => {
  if (isPanning.value) {
    return 'grabbing';
  }
  if (isZoomed.value) {
    return 'grab';
  }
  return 'zoom-in';
});

/**
 * @param {number} nextIndex
 */
function setIndex(nextIndex) {
  if (props.images.length === 0) {
    return;
  }
  const wrapped = ((nextIndex % props.images.length) + props.images.length) % props.images.length;
  if (wrapped === props.index) {
    return;
  }
  emit('update:index', wrapped);
}

function showPrev() {
  setIndex(props.index - 1);
}

function showNext() {
  setIndex(props.index + 1);
}

function close() {
  emit('close');
}

/**
 * @param {number} thumbIndex
 */
function goToThumb(thumbIndex) {
  setIndex(thumbIndex);
}

function scrollActiveThumbIntoView() {
  const thumb = activeThumbRefs.value[props.index];
  thumb?.scrollIntoView?.({
    block: 'nearest',
    inline: 'center',
    behavior: 'smooth'
  });
}

/**
 * @param {KeyboardEvent} event
 */
function handleKeyDown(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    close();
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    if (isZoomed.value) {
      panBy(ZOOM_PAN_STEP, 0);
    } else {
      showPrev();
    }
    return;
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    if (isZoomed.value) {
      panBy(-ZOOM_PAN_STEP, 0);
    } else {
      showNext();
    }
    return;
  }

  if (event.key === 'ArrowUp' && isZoomed.value) {
    event.preventDefault();
    panBy(0, ZOOM_PAN_STEP);
    return;
  }

  if (event.key === 'ArrowDown' && isZoomed.value) {
    event.preventDefault();
    panBy(0, -ZOOM_PAN_STEP);
  }
}

/**
 * @param {PointerEvent} event
 */
function onOverlayPointerDown(event) {
  if (event.target !== event.currentTarget) {
    return;
  }
  backdropPointerStart = { x: event.clientX, y: event.clientY };
  backdropMoved = false;
}

/**
 * @param {PointerEvent} event
 */
function onOverlayPointerMove(event) {
  if (!backdropPointerStart) {
    return;
  }
  const dx = event.clientX - backdropPointerStart.x;
  const dy = event.clientY - backdropPointerStart.y;
  if (Math.hypot(dx, dy) > 6) {
    backdropMoved = true;
  }
}

/**
 * @param {PointerEvent} event
 */
function onOverlayPointerUp(event) {
  if (event.target === event.currentTarget && !backdropMoved) {
    close();
  }
  backdropPointerStart = null;
  backdropMoved = false;
}

/**
 * @param {number} index
 * @param {HTMLElement | null} el
 */
function setThumbRef(index, el) {
  activeThumbRefs.value[index] = el;
}

watch(
  () => props.index,
  async () => {
    reset();
    await nextTick();
    scrollActiveThumbIntoView();
  }
);

onMounted(async () => {
  previouslyFocused = document.activeElement;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  window.addEventListener('keydown', handleKeyDown);
  await nextTick();
  stageRef.value?.focus?.({ preventScroll: true });
  scrollActiveThumbIntoView();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = previousOverflow;
  if (previouslyFocused instanceof HTMLElement) {
    previouslyFocused.focus({ preventScroll: true });
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox-fade" appear>
      <div
        class="lightbox-overlay"
        role="presentation"
        @pointerdown="onOverlayPointerDown"
        @pointermove="onOverlayPointerMove"
        @pointerup="onOverlayPointerUp"
      >
        <div
          ref="stageRef"
          class="lightbox-stage"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр скриншота"
          tabindex="-1"
          @click.stop
        >
          <button
            type="button"
            class="lightbox-close-btn"
            aria-label="Закрыть"
            @click="close"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <button
            v-if="canNavigate"
            type="button"
            class="lightbox-nav-btn lightbox-nav-btn--prev"
            aria-label="Предыдущий скриншот"
            @click="showPrev"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            v-if="canNavigate"
            type="button"
            class="lightbox-nav-btn lightbox-nav-btn--next"
            aria-label="Следующий скриншот"
            @click="showNext"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <div
            ref="viewportRef"
            class="lightbox-viewport"
            :style="{ cursor: viewportCursor }"
            @wheel.prevent="onWheel"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
            @dblclick="onDoubleClick"
          >
            <img
              v-if="activeImage"
              :key="activeImage"
              :src="activeImage"
              class="lightbox-img"
              :style="imageStyle"
              alt="Скриншот в полном размере"
              draggable="false"
            />
            <p v-if="canNavigate" class="lightbox-counter" aria-live="polite">{{ counterLabel }}</p>
          </div>

          <div v-if="canNavigate" class="lightbox-footer">
            <div class="lightbox-thumbs" role="list">
              <button
                v-for="(url, thumbIndex) in images"
                :key="url"
                :ref="(el) => setThumbRef(thumbIndex, /** @type {HTMLElement | null} */ (el))"
                type="button"
                class="lightbox-thumb"
                :class="{ 'lightbox-thumb--active': thumbIndex === index }"
                role="listitem"
                :aria-label="`Скриншот ${thumbIndex + 1}`"
                :aria-current="thumbIndex === index ? 'true' : undefined"
                @click="goToThumb(thumbIndex)"
              >
                <img :src="url" alt="" loading="lazy" decoding="async" draggable="false" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
}

.lightbox-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(1400px, 94vw);
  height: min(900px, 88vh);
  outline: none;
}

.lightbox-viewport {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  touch-action: none;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.35);
  user-select: none;
}

.lightbox-img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.55);
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.lightbox-counter {
  position: absolute;
  left: 50%;
  bottom: 0.65rem;
  z-index: 2;
  margin: 0;
  padding: 0.2rem 0.65rem;
  transform: translateX(-50%);
  border-radius: 999px;
  background: rgba(10, 10, 10, 0.55);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.82);
  pointer-events: none;
}

.lightbox-footer {
  flex: 0 0 84px;
  display: flex;
  align-items: center;
  margin-top: 0.75rem;
  min-height: 84px;
}

.lightbox-thumbs {
  display: flex;
  gap: 0.45rem;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.2rem 0.25rem 0.35rem;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.35) transparent;
}

.lightbox-thumbs::-webkit-scrollbar {
  height: 6px;
}

.lightbox-thumbs::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.35);
  border-radius: 999px;
}

.lightbox-thumb {
  flex: 0 0 auto;
  width: 72px;
  height: 48px;
  padding: 0;
  border: 2px solid rgba(255, 255, 255, 0.28);
  border-radius: 8px;
  overflow: hidden;
  background: #181818;
  cursor: pointer;
  scroll-snap-align: center;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.lightbox-thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.lightbox-thumb:hover {
  border-color: rgba(255, 255, 255, 0.65);
  transform: translateY(-1px);
}

.lightbox-thumb--active {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent);
}

.lightbox-thumb:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}

.lightbox-close-btn,
.lightbox-nav-btn {
  position: absolute;
  z-index: 3;
  background: rgba(20, 20, 20, 0.64);
  border: 1px solid rgba(255, 255, 255, 0.45);
  color: #ffffff;
  border-radius: 50%;
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.lightbox-close-btn {
  top: 0.75rem;
  right: 0.75rem;
}

.lightbox-nav-btn--prev {
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
}

.lightbox-nav-btn--next {
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
}

.lightbox-close-btn:hover,
.lightbox-nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.lightbox-close-btn:hover {
  transform: scale(1.1);
}

.lightbox-nav-btn--prev:hover {
  transform: translateY(-50%) scale(1.1);
}

.lightbox-nav-btn--next:hover {
  transform: translateY(-50%) scale(1.1);
}

.lightbox-close-btn:focus-visible,
.lightbox-nav-btn:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.25s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .lightbox-overlay {
    padding: 0.75rem;
  }

  .lightbox-stage {
    width: min(1400px, 96vw);
    height: min(900px, 92vh);
  }

  .lightbox-footer {
    height: 76px;
  }

  .lightbox-thumb {
    width: 64px;
    height: 42px;
  }
}

@media (max-width: 600px) {
  .lightbox-overlay {
    padding: 0.4rem;
  }

  .lightbox-close-btn,
  .lightbox-nav-btn {
    width: 2.5rem;
    height: 2.5rem;
  }

  .lightbox-nav-btn--prev {
    left: 0.4rem;
  }

  .lightbox-nav-btn--next {
    right: 0.4rem;
  }

  .lightbox-close-btn {
    top: 0.4rem;
    right: 0.4rem;
  }
}
</style>
