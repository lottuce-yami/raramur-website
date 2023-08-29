<script setup>
import { RouterLink, RouterView } from 'vue-router'
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
    <RouterView />
  </main>
</template>

<style scoped>
header {
  padding: 1rem;
  font-family: var(--font-heading);
  backdrop-filter: blur(10px);
}

header menu {
  display: flex;
  flex-direction: row-reverse;
  gap: 4rem;
  list-style: none;
}

header a {
  text-decoration: none;
  
  color: var(--black-soft);
  
}

main {
  padding: 0 8rem;
}
</style>
