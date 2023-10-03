<script setup>
import {RouterLink, useRoute} from "vue-router";
import {onMounted, onUnmounted, ref} from "vue";

const route = useRoute();
const isScrolled = ref(false);

function scrollListener() {
  isScrolled.value = scrollY > 0;
}

onMounted(() => {
  addEventListener('scroll', scrollListener)
});

onUnmounted(() => {
  removeEventListener('scroll', scrollListener)
});
</script>

<template>
  <header :class="{transparent: route.name === 'home', scrolled: isScrolled}">
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

/*noinspection CssUnusedSymbol*/
header.transparent {
  background-color: transparent;
  backdrop-filter: blur(10);
}

/*noinspection CssUnusedSymbol*/
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

/*noinspection CssUnusedSymbol*/
header .router-link-active {
  color: var(--color-accent);
}
</style>