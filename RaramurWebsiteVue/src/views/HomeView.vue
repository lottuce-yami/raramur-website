<script setup>
import ServerStatus from "@/components/ServerStatus.vue";
</script>

<template>
  <div>
    <article class="screen">
      <div class="background"></div>
      <hgroup class="server-name">
        <h1>Raramur</h1>
        <h2>Admire & Create</h2>
      </hgroup>
      <ServerStatus/>
    </article>
    <article class="description">
      <p>
        <strong>Рарамур</strong> - это приватный Minecraft-сервер с сезонным форматом игры.
        Длительность сезона всегда разная,
        а темы ничем не ограничены - это может быть как ванильное выживание,
        так и какая-нибудь приключенческая карта или сборка с модами.
        Но главная черта Рарамура - его обитатели: еноты, рыбы и даже спидранеры...
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
  background: url("@/assets/japanese-village.webp") 0 0 / cover no-repeat;
  filter: blur(2px);
  mask: url("@/assets/about-top-mask.svg") bottom no-repeat, url("@/assets/rectangle.svg");
  mask-composite: exclude;
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