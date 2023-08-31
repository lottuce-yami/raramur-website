<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <menu>
      <li>
        <RouterLink to="/">Главная</RouterLink>
      </li>
      <li>
        <RouterLink to="/history">История</RouterLink>
      </li>
    </menu>
  </header>
  <main>
    <Router-View v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <Component :is="Component"/>
      </Transition>
    </Router-View>
  </main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

header {
  position: fixed;
  width: 100%;
  padding: 1rem 8rem;
  backdrop-filter: blur(10px);
  font-family: var(--font-heading);
}

header menu {
  display: flex;
  flex-direction: row-reverse;
  gap: 4rem;
  list-style: none;
}

header a {
  line-height: 2;
  text-decoration: none;
  color: var(--black-soft);
}

header .router-link-active {
  color: var(--color-accent);
}

main {
  padding: 4rem 8rem 0;
}
</style>
