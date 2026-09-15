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
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  margin-top: calc(-1 * var(--page-top));
  margin-left: calc(-1 * var(--page-x));
  margin-right: calc(-1 * var(--page-x));
  margin-bottom: 0;
  padding-top: var(--page-top);
  padding-left: max(var(--page-x), 1.25rem);
  padding-right: max(var(--page-x), 1.25rem);
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
}

.background {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  -webkit-mask: url("@/assets/masks/about-top-mask.svg") bottom / 100% 90px no-repeat,
    url("@/assets/masks/rectangle.svg");
  mask: url("@/assets/masks/about-top-mask.svg") bottom / 100% 90px no-repeat,
    url("@/assets/masks/rectangle.svg");
  mask-composite: exclude;
  -webkit-mask-composite: xor;
}

.background::before {
  content: "";
  position: absolute;
  inset: -10px;
  background: url("@/assets/images/japanese-village.webp") center / cover no-repeat;
  filter: blur(2px);
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

@media (max-width: 768px) {
  .screen {
    justify-content: flex-start;
    align-items: center;
    text-align: center;
    /* Sit the title/status on the pale sky, not over the dark building mid-frame. */
    padding-top: clamp(5rem, 16vh, 7.5rem);
    padding-bottom: clamp(4rem, 22vh, 9rem);
  }

  .background::before {
    background-position: 50% 40%;
  }

  .background {
    -webkit-mask-size: 100% 44px, auto;
    mask-size: 100% 44px, auto;
  }

  .server-name h1 {
    font-size: 4rem;
  }

  .server-name h2 {
    font-size: 2rem;
  }

  .description {
    padding: 0 1.15rem 2rem;
    font-size: 1.15rem;
    line-height: 1.55;
  }
}

@media (max-width: 600px) {
  .screen {
    padding-left: 1.15rem;
    padding-right: 1.15rem;
  }
}

@media (max-width: 480px) {
  .server-name h1 {
    font-size: 2.75rem;
  }

  .description {
    font-size: 1.05rem;
  }
}
</style>
