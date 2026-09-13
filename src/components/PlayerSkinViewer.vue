<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { SkinViewer } from 'skinview3d';

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

const canvasRef = ref(null);
const containerRef = ref(null);
const isLoading = ref(true);
const isRotating = ref(false);
let skinViewer = null;

function applyIsometricPose() {
  if (!skinViewer) return;

  // Camera and target scaled for larger 290px box:
  // Character is prominently sized while keeping ample headroom below NameMC badge
  skinViewer.controls.target.set(0, 2, 0);
  skinViewer.camera.position.set(21, 5, 43);
  skinViewer.controls.update();

  // Natural Minecraft standing pose
  const skin = skinViewer.playerObject.skin;
  if (skin) {
    skin.leftArm.rotation.x = -0.15;
    skin.rightArm.rotation.x = 0.15;
    skin.leftLeg.rotation.x = 0.12;
    skin.rightLeg.rotation.x = -0.12;
    skin.head.rotation.y = -0.2;
    skin.head.rotation.x = 0.08;
  }
  skinViewer.render();
}

function resetPose() {
  applyIsometricPose();
}

async function initViewer() {
  if (!canvasRef.value) return;

  try {
    isLoading.value = true;

    // Dispose previous instance if any
    if (skinViewer) {
      skinViewer.dispose();
      skinViewer = null;
    }

    // Initialize skin viewer with 240x290 dimensions
    skinViewer = new SkinViewer({
      canvas: canvasRef.value,
      width: 240,
      height: 290,
      enableControls: true
    });

    // Make viewer background transparent so it blends with CSS container
    skinViewer.background = null;
    skinViewer.fov = 48;

    // Load skin with fallback
    try {
      await skinViewer.loadSkin(props.skinUrl);
    } catch (e) {
      // Fallback to minotar or Steve skin
      try {
        await skinViewer.loadSkin(`https://minotar.net/skin/${props.username}`);
      } catch (err2) {
        await skinViewer.loadSkin('https://mc-heads.net/skin/MHF_Steve');
      }
    }

    applyIsometricPose();

    // Optimize render loop: only render on interaction (OrbitControls change)
    skinViewer.renderPaused = true;
    skinViewer.controls.addEventListener('change', () => {
      if (skinViewer && !skinViewer.disposed) {
        skinViewer.render();
      }
    });

    skinViewer.controls.addEventListener('start', () => {
      isRotating.value = true;
    });

    skinViewer.controls.addEventListener('end', () => {
      isRotating.value = false;
    });

    isLoading.value = false;
  } catch (err) {
    console.error('Failed to initialize SkinViewer for', props.username, err);
    isLoading.value = false;
  }
}

onMounted(() => {
  initViewer();
});

onUnmounted(() => {
  if (skinViewer) {
    skinViewer.dispose();
    skinViewer = null;
  }
});

watch(() => props.skinUrl, () => {
  initViewer();
});
</script>

<template>
  <div
    ref="containerRef"
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

    <!-- 3D Skin Canvas -->
    <div class="canvas-container">
      <div v-if="isLoading" class="skin-loading">
        <div class="skin-spinner"></div>
      </div>
      <canvas ref="canvasRef" class="skin-canvas"></canvas>
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
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  font-size: 0.75rem;
  font-family: var(--font-heading);
  font-weight: bold;
  color: var(--black-soft);
  text-decoration: none;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
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
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  color: var(--black-mute);
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
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
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
}

.canvas-container:active {
  cursor: grabbing;
}

.skin-canvas {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain;
  display: block;
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
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  font-size: 0.7rem;
  font-family: var(--font-brand);
  color: var(--black-mute);
  pointer-events: none;
  backdrop-filter: blur(2px);
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
