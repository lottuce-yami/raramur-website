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
  <p class="server-status">
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
      <span class="server-status-offline">&#9632; Оффлайн</span>
    </template>
    <span class="server-status-ip">IP: raramur.ru</span>
  </p>
  <!--TODO spinner-->
  <p class="server-status-loading">
    …
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
</style>