<script setup>
import {ref, inject, onMounted, onUnmounted} from 'vue';

const axios = inject('axios');
const status = ref({});
const loading = ref(true)
let interval;

function updateStatus() {
  loading.value = true
  axios.get('https://api.mcsrvstat.us/3/lottuce.moe')
    .then(response => status.value = response.data)
    .finally(() => loading.value = false)
}

onMounted(() => {
  updateStatus();
  interval = setInterval(updateStatus, 60000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <p v-if="loading" class="server-status-loading">
    <span class="loader"></span>
  </p>
  <p v-if="!loading" class="server-status">
    <template v-if="status.online">
      <span class="server-status-online">&#9679; Онлайн</span>
      <span class="server-status-players">
        Игроков: 
        <span :class="status.players.online > 0 ? 'server-status-players-online' : 'server-status-players-offline'">
          {{ status.players.online }}
        </span>
        / {{ status.players.max }}
      </span>
      <span class="server-status-version">Версия: {{ status.version }}</span>
    </template>
    <template v-if="!status.online">
      <span class="server-status-offline">&#9632; Офлайн</span>
    </template>
    <span class="server-status-ip">IP: lottuce.moe</span>
  </p>
</template>

<style scoped>
.server-status {
  display: flex;
  gap: 2rem;
  font-family: var(--font-alt);
}

.server-status-online, .server-status-players-online {
  color: var(--color-true);
}

.server-status-offline, .server-status-players-offline {
  color: var(--color-false);
}

.loader {
  width: 2rem;
  height: 2rem;
  border: .33rem solid var(--color-accent);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
}
} 
</style>