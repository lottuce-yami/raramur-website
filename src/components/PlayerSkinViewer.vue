<script>
// A single observer for the whole grid; posters are only rendered for cards
// that are on screen or about to be.
const pendingReveals = new WeakMap();
let revealObserver = null;

function revealOnce(el, callback) {
  if (typeof IntersectionObserver === 'undefined') {
    callback();
    return () => {};
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const handler = pendingReveals.get(entry.target);
          revealObserver.unobserve(entry.target);
          pendingReveals.delete(entry.target);
          handler?.();
        }
      },
      { rootMargin: '400px 0px' }
    );
  }

  pendingReveals.set(el, callback);
  revealObserver.observe(el);

  return () => {
    pendingReveals.delete(el);
    revealObserver?.unobserve(el);
  };
}
</script>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import {
  lendStageTo,
  renderPoster,
  resetLentPose,
  retainStage,
  releaseStage,
  returnStage
} from '@/services/skinStage';

const props = defineProps({
  username: {
    type: String,
    required: true
  },
  skinUrl: {
    type: String,
    required: true
  },
  namemcUrl: {
    type: String,
    default: ''
  },
  locatorColor: {
    type: String,
    default: '#FF738F'
  }
});

const canvasHostRef = ref(null);
const isLoading = ref(true);
const isLive = ref(false);
const isRotating = ref(false);

const posterUrl = ref(null);

let stageToken = null;
let posterRequest = 0;
let hovering = false;
let stopReveal = null;

async function loadPoster() {
  const request = ++posterRequest;
  isLoading.value = true;

  const url = await renderPoster(props.skinUrl, props.username);
  if (request !== posterRequest) return;

  posterUrl.value = url;
  isLoading.value = false;
}

async function goLive() {
  if (stageToken || !canvasHostRef.value) return;

  const token = await lendStageTo(canvasHostRef.value, {
    skinUrl: props.skinUrl,
    username: props.username,
    onRotateStart: () => {
      isRotating.value = true;
    },
    onRotateEnd: () => {
      isRotating.value = false;
      if (!hovering) goStatic();
    }
  });

  if (!token) return;

  // The pointer may have moved on while the texture was still downloading.
  if (!hovering) {
    returnStage(token);
    return;
  }

  stageToken = token;
  isLive.value = true;
}

// The poster always holds the canonical pose, so handing the canvas back is all
// it takes for the card to snap out of whatever angle the user left it at.
function goStatic() {
  if (!stageToken) return;

  returnStage(stageToken);
  stageToken = null;
  isLive.value = false;
  isRotating.value = false;
}

function onPointerEnter() {
  hovering = true;
  goLive();
}

function onPointerLeave() {
  hovering = false;
  // Releasing mid-drag would cancel the rotation; goStatic runs on rotate end.
  if (isRotating.value) return;
  goStatic();
}

function resetPose() {
  if (stageToken) resetLentPose(stageToken);
}

onMounted(() => {
  retainStage();
  stopReveal = revealOnce(canvasHostRef.value, loadPoster);
});

onBeforeUnmount(() => {
  stopReveal?.();
  if (stageToken) returnStage(stageToken);
  stageToken = null;
  releaseStage();
});

watch(
  () => props.skinUrl,
  () => {
    loadPoster();
    if (stageToken) {
      goStatic();
      if (hovering) goLive();
    }
  }
);
</script>

<template>
  <div
    class="skin-box"
    :style="{ '--locator-glow': locatorColor }"
    @dblclick="resetPose"
    title="Потяните для вращения в 3D. Двойной клик — сброс ракурса."
  >
    <!-- Top Bar with NameMC link & Reset Button -->
    <div class="skin-box-header">
      <a
        v-if="namemcUrl"
        :href="namemcUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="namemc-badge"
        title="Смотреть профиль на NameMC"
        @click.stop
      >
        <span>NameMC</span>
        <svg class="external-icon" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
      <button
        type="button"
        class="reset-btn"
        title="Сбросить ракурс 3D"
        @click.stop="resetPose"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" class="reset-icon">
          <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
          <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
        </svg>
      </button>
    </div>

    <!-- Static render, swapped for the shared 3D canvas while hovered -->
    <div
      ref="canvasHostRef"
      class="canvas-container"
      @pointerenter="onPointerEnter"
      @pointerleave="onPointerLeave"
    >
      <div v-if="isLoading" class="skin-loading">
        <div class="skin-spinner"></div>
      </div>
      <img
        v-if="posterUrl"
        :src="posterUrl"
        :alt="`Скин игрока ${username}`"
        class="skin-still"
        :class="{ 'is-hidden': isLive }"
        decoding="async"
        draggable="false"
      />
    </div>

    <!-- Pedestal Base (Minecraft isometric block feel) -->
    <div class="pedestal">
      <div class="pedestal-plate"></div>
    </div>

    <!-- Rotate Hint Badge -->
    <div class="rotate-hint" :class="{ 'is-active': isRotating }">
      <svg class="rotate-icon" viewBox="0 0 16 16" fill="currentColor">
        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-7.068 2H.534a.25.25 0 0 1-.192-.41l1.966-2.36a.25.25 0 0 1 .384 0l1.966 2.36a.25.25 0 0 1-.192.41z"/>
        <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6 6 0 1 1 2.05 8.5a.5.5 0 0 1 .99-.153A5 5 0 1 0 8 3z"/>
      </svg>
      <span>3D</span>
    </div>
  </div>
</template>

<style scoped>
.skin-box {
  position: relative;
  width: 100%;
  height: 290px;
  background: radial-gradient(circle at 50% 25%, #ffffff 0%, #f4f5f8 100%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9),
              0 2px 6px rgba(0, 0, 0, 0.02);
  user-select: none;
}

.skin-box-header {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
  pointer-events: none;
}

.namemc-badge {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 7px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  font-size: 0.75rem;
  font-family: var(--font-heading);
  font-weight: bold;
  color: var(--black-soft);
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.namemc-badge:hover {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(255, 115, 143, 0.3);
}

.external-icon {
  width: 9px;
  height: 9px;
}

.reset-btn {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  color: var(--black-mute);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  padding: 0;
}

.reset-btn:hover {
  background: #fff;
  color: var(--color-accent);
  border-color: var(--color-accent);
  transform: rotate(-30deg);
}

.reset-icon {
  width: 12px;
  height: 12px;
}

.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  touch-action: none;
}

.canvas-container:active {
  cursor: grabbing;
}

.skin-still {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

/* The live canvas is stacked on top, so the still only needs hiding. */
.skin-still.is-hidden {
  visibility: hidden;
}

.pedestal {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 1;
}

.pedestal-plate {
  width: 95px;
  height: 16px;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.02) 65%, transparent 75%);
  border-radius: 50%;
}

.rotate-hint {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  font-size: 0.7rem;
  font-family: var(--font-brand);
  color: var(--black-mute);
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.rotate-hint.is-active {
  opacity: 0.3;
}

.rotate-icon {
  width: 10px;
  height: 10px;
}

.skin-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 245, 245, 0.7);
}

.skin-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
