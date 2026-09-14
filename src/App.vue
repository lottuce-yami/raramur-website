<script setup>
import { RouterView } from 'vue-router';
import TheHeader from "@/components/TheHeader.vue";
</script>

<template>
  <TheHeader/>
  <main class="page">
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

.page {
  --page-x: 8rem;
  --page-top: 4rem;
  padding: var(--page-top) var(--page-x) 0;
}

@media (max-width: 900px) {
  .page {
    --page-x: 1.5rem;
  }
}

@media (max-width: 600px) {
  .page {
    --page-x: 0px;
  }
}
</style>
