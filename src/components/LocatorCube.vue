<script setup>
defineProps({
  /**
   * Hex color string (e.g. #FF738F) representing player's locator bar mark.
   */
  color: {
    type: String,
    required: true
  },
  /**
   * Pixel size of the square (default 12px).
   */
  size: {
    type: [Number, String],
    default: 12
  }
});
</script>

<template>
  <span
    class="locator-square"
    :style="{
      '--mark-color': color,
      width: `${size}px`,
      height: `${size}px`
    }"
  ></span>
</template>

<style scoped>
.locator-square {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  border-radius: 2px;
  background-color: var(--mark-color);
  border: 1px solid rgba(0, 0, 0, 0.14);
  box-shadow: 0 0 7px var(--mark-color), 0 0 1px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  margin-top: 1px;
}
</style>
