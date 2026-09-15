<script setup>
import locatorDotTexture from '@/assets/textures/locator-bar-dot.png';

defineProps({
  /**
   * Hex color string (e.g. #FF738F) representing player's locator bar mark.
   */
  color: {
    type: String,
    required: true
  },
  /**
   * Rendered pixel size of the mark (default 16px).
   */
  size: {
    type: [Number, String],
    default: 16
  }
});
</script>

<template>
  <span
    class="locator-mark"
    :style="{
      '--mark-color': color,
      '--mark-texture': `url(${locatorDotTexture})`,
      width: `${size}px`,
      height: `${size}px`
    }"
  ></span>
</template>

<style scoped>
/*
  Recreates the vanilla Minecraft locator bar dot (assets/minecraft/textures/gui/sprites/hud/locator_bar_dot/default_0.png):
  a color-tinted circle with a dark outline. The texture is masked in for the
  outline/silhouette, then multiply-blended on top of the flat fill color so its
  black border and shaded edge pixels darken the tint exactly like the game's
  GL color-modulated render of the mark.
*/
.locator-mark {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  box-sizing: border-box;
  margin-top: 1px;
  background-color: var(--mark-color);
  -webkit-mask-image: var(--mark-texture);
  mask-image: var(--mark-texture);
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  image-rendering: pixelated;
  filter: drop-shadow(0 0 4px var(--mark-color));
}

.locator-mark::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--mark-texture);
  background-size: contain;
  background-repeat: no-repeat;
  mix-blend-mode: multiply;
  image-rendering: pixelated;
}
</style>
