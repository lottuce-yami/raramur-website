<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';
import { useInViewport } from '@/composables/useInViewport.js';

const props = defineProps({
  /**
   * Season folder under /images/history/, e.g. "original", "v2.0"
   */
  folder: {
    type: String,
    required: true
  },
  /**
   * Chapter number used in filenames: {chapter}_{index}.webp
   */
  chapter: {
    type: Number,
    required: true
  },
  /**
   * Number of images in this gallery chapter
   */
  count: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['open']);

const { target, hasEntered, isVisible } = useInViewport();

const slidesRef = ref(null);
const activeIndex = ref(0);
const showBackdrop = ref(true);

/** @type {MediaQueryList | null} */
let backdropMediaQuery = null;

function syncBackdropPreference() {
  showBackdrop.value = !(backdropMediaQuery?.matches ?? false);
}

onMounted(() => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return;
  }

  backdropMediaQuery = window.matchMedia('(max-width: 768px)');
  syncBackdropPreference();
  backdropMediaQuery.addEventListener('change', syncBackdropPreference);
});

onUnmounted(() => {
  backdropMediaQuery?.removeEventListener('change', syncBackdropPreference);
  backdropMediaQuery = null;
});

const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

const images = computed(() => {
  const urls = [];
  for (let i = 1; i <= props.count; i++) {
    urls.push(`${baseUrl}/images/history/${props.folder}/${props.chapter}_${i}.webp`);
  }
  return urls;
});

const isMultiple = computed(() => props.count > 1);

/**
 * Indices of slides that should load their images (active +/- 1, wrapping).
 * @param {number} index
 */
function shouldLoadImage(index) {
  const count = props.count;
  if (count <= 3) {
    return true;
  }

  const active = activeIndex.value;
  for (let offset = -1; offset <= 1; offset++) {
    const wrapped = ((active + offset) % count + count) % count;
    if (wrapped === index) {
      return true;
    }
  }
  return false;
}

/**
 * @param {{ currentSlide?: { index?: number } }} payload
 */
function handleSlide(payload) {
  const index = payload?.currentSlide?.index;
  if (typeof index === 'number') {
    activeIndex.value = index;
  }
}

function handleOpen(url) {
  emit('open', url);
}

watch(isVisible, (visible) => {
  const slides = slidesRef.value;
  if (!slides || !isMultiple.value) {
    return;
  }

  if (visible) {
    slides.resumeAutoplay?.();
  } else {
    slides.pauseAutoplay?.();
  }
});

watch(hasEntered, (entered) => {
  if (!entered || !isMultiple.value) {
    return;
  }

  // Pause immediately after mount if the gallery is still off-screen.
  queueMicrotask(() => {
    const slides = slidesRef.value;
    if (slides && !isVisible.value) {
      slides.pauseAutoplay?.();
    }
  });
});
</script>

<template>
  <div
    ref="target"
    class="history-gallery-shell"
  >
    <VueperSlides
      v-if="hasEntered"
      ref="slidesRef"
      class="history-gallery"
      :slide-ratio="9 / 16"
      fixed-height
      :touchable="true"
      :arrows="isMultiple"
      :bullets="isMultiple"
      :autoplay="isMultiple"
      :duration="isMultiple ? 10000 : undefined"
      @slide="handleSlide"
    >
      <VueperSlide v-for="(url, index) in images" :key="index">
        <template #content>
          <button
            type="button"
            class="gallery-frame"
            :aria-label="`Открыть скриншот ${index + 1}`"
            @click="handleOpen(url)"
          >
            <img
              v-if="showBackdrop && shouldLoadImage(index)"
              class="gallery-backdrop"
              :src="url"
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              draggable="false"
            />
            <img
              v-if="shouldLoadImage(index)"
              class="gallery-image"
              :src="url"
              :alt="`Скриншот ${folder} ${chapter}-${index + 1}`"
              loading="lazy"
              decoding="async"
              draggable="false"
            />
          </button>
        </template>
      </VueperSlide>
    </VueperSlides>
  </div>
</template>

<style scoped>
.history-gallery-shell {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 14px;
  overflow: hidden;
  background: #181818;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.history-gallery {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  overflow: hidden;
  background: #181818;
}

.gallery-frame {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: zoom-in;
  overflow: hidden;
  user-select: none;
}

.gallery-backdrop {
  position: absolute;
  inset: -8%;
  width: 116%;
  height: 116%;
  object-fit: cover;
  filter: blur(22px) brightness(0.52) saturate(0.8);
  transform: scale(1.05);
  opacity: 0.7;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.gallery-image {
  position: relative;
  z-index: 1;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  user-select: none;
  pointer-events: none;
  -webkit-user-drag: none;
}

:deep(.vueperslide) {
  background: transparent !important;
}

:deep(.vueperslides__arrow) {
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  color: #ffffff;
  background: rgba(20, 20, 20, 0.62);
  border-radius: 50%;
  opacity: 1;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
  transform: none !important;
  transition: background 0.2s ease;
}

:deep(.vueperslides__arrow:hover) {
  background: rgba(20, 20, 20, 0.82);
  transform: none !important;
}

:deep(.vueperslides__arrow--prev) {
  left: 0.65rem;
}

:deep(.vueperslides__arrow--next) {
  right: 0.65rem;
}

:deep(.vueperslides__arrow svg) {
  width: 1.35rem;
  height: 1.35rem;
  padding: 0;
  filter: none;
}

:deep(.vueperslides__bullets) {
  padding-bottom: 0.65rem;
}

:deep(.vueperslides__bullet) {
  margin: 0 4px;
}

:deep(.vueperslides__bullet .default) {
  background-color: rgba(255, 255, 255, 0.45);
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
  transition: all 0.25s ease;
  width: 8px;
  height: 8px;
}

:deep(.vueperslides__bullet--active .default) {
  background-color: var(--color-accent);
  transform: scale(1.35);
}

:deep(.vueperslides__inner),
:deep(.vueperslide) {
  background: transparent;
}

@media (max-width: 480px) {
  :deep(.vueperslides__arrow) {
    width: 2.75rem;
    height: 2.75rem;
  }

  :deep(.vueperslides__arrow--prev) {
    left: 0.4rem;
  }

  :deep(.vueperslides__arrow--next) {
    right: 0.4rem;
  }

  :deep(.vueperslides__arrow svg) {
    width: 1.25rem;
    height: 1.25rem;
  }
}
</style>
