<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import whitelist from '../../whitelist.json';
import { getInitialPlayerData, resolvePlayerData } from '@/services/playerService';
import PlayerSkinViewer from '@/components/PlayerSkinViewer.vue';
import LocatorMark from '@/components/LocatorMark.vue';

// Initialize reactive list of players from whitelist usernames
const players = reactive(
  whitelist.map(entry => getInitialPlayerData(typeof entry === 'string' ? entry : entry.username))
);

const copiedUser = ref(null);
let copyTimeout = null;

function copyUsername(username) {
  navigator.clipboard.writeText(username).then(() => {
    copiedUser.value = username;
    if (copyTimeout) clearTimeout(copyTimeout);
    copyTimeout = setTimeout(() => {
      if (copiedUser.value === username) {
        copiedUser.value = null;
      }
    }, 1500);
  });
}

let cancelMetadataTask = null;
let unmounted = false;

async function resolveMissingMetadata() {
  const unresolved = players.filter((player) => !player.uuid);

  // Sequential on purpose: the grid is busy rendering skins, and these lookups
  // only refine data that is already on screen.
  for (const player of unresolved) {
    const resolved = await resolvePlayerData(player.username);
    if (unmounted) return;
    Object.assign(player, resolved);
  }
}

onMounted(() => {
  // Kept off the first-paint path; nothing visible is blocked by it.
  if (typeof requestIdleCallback === 'function') {
    const handle = requestIdleCallback(resolveMissingMetadata, { timeout: 2000 });
    cancelMetadataTask = () => cancelIdleCallback(handle);
  } else {
    const handle = setTimeout(resolveMissingMetadata, 400);
    cancelMetadataTask = () => clearTimeout(handle);
  }
});

onBeforeUnmount(() => {
  unmounted = true;
  cancelMetadataTask?.();
  if (copyTimeout) clearTimeout(copyTimeout);
});
</script>

<template>
  <div class="content">
    <div class="header-section">
      <h1 class="page-heading">Вайтлист Рарамура</h1>
    </div>

    <!-- Players Grid -->
    <div class="players-grid">
      <article
        v-for="player in players"
        :key="player.username"
        class="player-card"
      >
        <!-- 3D Isometric Skin Box -->
        <div class="skin-wrapper">
          <PlayerSkinViewer
            :username="player.username"
            :skin-url="player.skinUrl"
            :namemc-url="player.namemcUrl"
            :locator-color="player.locatorColor"
          />
        </div>

        <!-- Under it: Username with the official Minecraft locator bar mark -->
        <div class="username-row">
          <LocatorMark :color="player.locatorColor" :size="32" />
          <span
            class="player-username"
            @click="copyUsername(player.username)"
            title="Нажмите, чтобы скопировать ник"
          >
            {{ player.username }}
          </span>
          <Transition name="fade-check">
            <span
              v-if="copiedUser === player.username"
              class="copied-checkmark"
              title="Скопировано!"
            >
              <svg viewBox="0 0 12 12" fill="none" class="check-svg" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6.5L4.5 9L10 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </Transition>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.content {
  background-color: var(--color-main);
  padding: 0 2rem 4rem;
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-section {
  margin-bottom: 2rem;
}

.page-heading {
  font-family: var(--font-heading);
  font-size: 3rem;
  line-height: 1.25;
  margin-bottom: 0.75rem;
  background: linear-gradient(0deg, var(--color-accent), var(--color-accent-alt));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

/* Players Grid */
.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.player-card {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0.85rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03), 0 6px 16px -4px rgba(0, 0, 0, 0.04);
  /* Skips layout and paint for cards outside the viewport, which keeps
     scrolling flat as the whitelist grows. */
  content-visibility: auto;
  contain-intrinsic-size: auto 356px;
}

.skin-wrapper {
  margin-bottom: 0.75rem;
}

/* Under the Skin Box: Username row with the locator mark */
.username-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 40px;
  padding: 0.15rem 0.25rem;
}

.player-username {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1;
  color: var(--black);
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  margin-top: 2px;
  transition: color 0.15s ease;
}

.player-username:hover {
  color: var(--color-accent);
}

.copied-checkmark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-true);
  margin-left: 4px;
  margin-top: 2px;
  flex-shrink: 0;
  line-height: 1;
}

.check-svg {
  width: 18px;
  height: 18px;
}

.fade-check-enter-active,
.fade-check-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-check-enter-from,
.fade-check-leave-to {
  opacity: 0;
  transform: translateX(-3px);
}

/* Responsive adjustments */
@media (max-width: 900px) {
  .content {
    padding: 0 1rem 3rem;
  }
  .page-heading {
    font-size: 2.2rem;
  }
  .players-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 0 0.5rem 2.5rem;
  }

  .page-heading {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 1rem;
    text-align: left;
  }

  .players-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .player-card {
    padding: 0.65rem;
    border-radius: 12px;
  }

  .player-username {
    font-size: 1rem;
  }
}
</style>
