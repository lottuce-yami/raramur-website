<script setup>
import TheServerStatus from "@/components/TheServerStatus.vue";
</script>

<template>
  <div>
    <article class="screen">
      <div class="background"></div>
      <hgroup class="server-name">
        <h1>Raramur</h1>
      </hgroup>
      <TheServerStatus/>
    </article>
    <article class="description">
      <p>
        <strong>Рарамур</strong> — это приватный Minecraft-сервер с сезонным форматом игры. Длительность сезона всегда
        разная, а темы ничем не ограничены — это может быть как ванильное выживание, так и приключенческая карта или 
        сборка с модами. Но отличительная черта Рарамура — его обитатели: еноты, рыбы, спидранеры и даже стримеры…
      </p>
    </article>
  </div>
</template>

<style scoped>
.screen {
  height: 100vh;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: url("@/assets/images/japanese-village.webp") 0 0 / cover no-repeat;
  filter: blur(2px);
  -webkit-mask: url("@/assets/masks/about-top-mask.svg") bottom no-repeat, url("@/assets/masks/rectangle.svg");
  mask-composite: exclude;
  -webkit-mask-composite: xor;
}

.server-name {
  line-height: 1;
  margin-bottom: 1rem;
  font-family: var(--font-brand);
}

.server-name h1 {
  font-size: 8rem;
  text-transform: uppercase;
  background: linear-gradient(0deg, var(--color-accent), var(--color-accent-alt));
  background-size: 100%;
  background-clip: text;
  color: transparent;
}

.server-name h2 {
  font-size: 4rem;
  color: var(--color-accent);
}

.description {
  padding-bottom: 2rem;
  font-size: 2rem;
  text-align: center;
}

.description strong {
  color: var(--color-accent-alt);
}
</style>