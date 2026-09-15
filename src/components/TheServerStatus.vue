<script setup>
import {ref, inject, onMounted, onUnmounted} from 'vue';

const SERVER_IP = 'raramur.lottuce.moe';

const axios = inject('axios');
const status = ref({});
const loading = ref(true);
const ipCopied = ref(false);
let interval;
let ipCopiedTimeout = null;

function updateStatus() {
  loading.value = true
  axios.get(`https://api.mcsrvstat.us/3/${SERVER_IP}`)
    .then(response => status.value = response.data)
    .finally(() => loading.value = false)
}

async function copyIp() {
  try {
    await navigator.clipboard.writeText(SERVER_IP);
  } catch {
    return;
  }

  ipCopied.value = true;
  clearTimeout(ipCopiedTimeout);
  ipCopiedTimeout = setTimeout(() => {
    ipCopied.value = false;
  }, 1500);
}

onMounted(() => {
  updateStatus();
  interval = setInterval(updateStatus, 60000);
});

onUnmounted(() => {
  clearInterval(interval);
  clearTimeout(ipCopiedTimeout);
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
    <button
      type="button"
      class="ip-badge"
      :title="ipCopied ? 'IP скопирован!' : 'Скопировать IP'"
      @click="copyIp"
    >
      <Transition name="ip-icon" mode="out-in">
        <svg v-if="ipCopied" key="check" class="ip-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <svg v-else key="clipboard" class="ip-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        </svg>
      </Transition>
      IP: {{ SERVER_IP }}
    </button>
  </p>
</template>

<style scoped>
.server-status {
  display: flex;
  align-items: center;
  gap: 2rem;
  font-family: var(--font-alt);
}

.server-status-online, .server-status-players-online {
  color: var(--color-true);
}

.server-status-offline, .server-status-players-offline {
  color: var(--color-false);
}

.ip-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 1rem;
  background: rgba(255, 115, 143, 0.1);
  border: 1px solid rgba(255, 115, 143, 0.28);
  border-radius: 9999px;
  font-size: 0.88rem;
  font-weight: 600;
  font-family: inherit;
  color: var(--color-accent);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.ip-badge:hover {
  background: rgba(255, 115, 143, 0.18);
  border-color: var(--color-accent);
  color: var(--color-accent-alt);
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(255, 115, 143, 0.18);
}

.ip-badge:active {
  transform: translateY(0);
}

.ip-badge:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.ip-icon {
  flex-shrink: 0;
}

.ip-icon-enter-active,
.ip-icon-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.ip-icon-enter-from,
.ip-icon-leave-to {
  opacity: 0;
  transform: scale(0.4);
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
