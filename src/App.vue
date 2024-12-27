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
/*noinspection CssUnusedSymbol*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

/*noinspection CssUnusedSymbol*/
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.page {
  padding: 4rem 8rem 0;
}
</style>
