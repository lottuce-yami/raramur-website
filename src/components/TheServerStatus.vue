<script setup>
import {ref, inject, onMounted, onUnmounted} from 'vue';

const axios = inject('axios');
const status = ref({});
let interval;

function updateStatus() {
  axios.get('https://api.mcsrvstat.us/3/raramur.ru').then(response => status.value = response.data);
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
  <p v-if="status.online">
    <span class="online">&#9679; Онлайн</span>
    <span>Игроков: <span :class="status.players.online > 0 ? 'online' : 'offline'">{{status.players.online}}</span> / {{status.players.max}}</span>
    <span>Версия: {{status.version}}</span>
    <span>IP: raramur.ru</span>
  </p>
  <p v-else>
    <span class="offline">&#9632; Оффлайн</span>
  </p>
</template>

<style scoped>
p {
  display: flex;
  gap: 2rem;
  font-family: var(--font-alt);
}

.online {
  color: var(--color-true);
}

.offline {
  color: var(--color-false);
}
</style>