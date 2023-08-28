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
  <RouterView />
</template>

<style scoped>

</style>
