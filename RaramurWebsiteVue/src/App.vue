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
      <li>
        <RouterLink to="/status">Статус</RouterLink>
      </li>
    </menu>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  padding: 1rem 8rem;
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

main {
  padding: 2rem 8rem 0;
}
</style>
