<script setup>
import { RouterView } from 'vue-router';
import TheHeader from "@/components/TheHeader.vue";
</script>

<template>
  <TheHeader/>
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

main {
  padding: 4rem 8rem 0;
}
</style>
