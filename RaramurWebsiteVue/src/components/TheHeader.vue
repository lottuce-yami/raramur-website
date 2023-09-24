<script setup>
import {RouterLink, useRoute} from "vue-router";
import {onMounted, onUnmounted, ref} from "vue";

const route = useRoute();
const headerRef = ref(null);

onMounted(() => {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) headerRef.value.classList.add('scrolled');
    else headerRef.value.classList.remove('scrolled');
  })
});

onUnmounted(() => {
  window.removeEventListener('scroll', () => {
    if (window.scrollY > 0) headerRef.value.classList.add('scrolled');
    else headerRef.value.classList.remove('scrolled');
  })
});
</script>

<template>
  <header ref="headerRef" :class="route.name === 'home' ? 'transparent' : ''">
    <menu>
      <li>
        <RouterLink to="/">Главная</RouterLink>
      </li>
      <li>
        <RouterLink to="/history">История</RouterLink>
      </li>
    </menu>
  </header>
</template>

<style scoped>
header {
  position: fixed;
  z-index: 4;
  width: 100%;
  padding: 1rem 8rem;
  font-family: var(--font-heading);
  background-color: var(--color-main);
  transition: all 0.5s ease-in-out;
}

header.transparent {
  background-color: transparent;
  backdrop-filter: blur(10);
}

header.scrolled {
  background-color: var(--color-main);
  transition: all 0.5s ease-in-out;
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
</style>