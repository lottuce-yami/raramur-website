<script setup>
import { onUnmounted, ref } from 'vue';

const props = defineProps({
  /**
   * Full title of the server.
   * If nullish, fallbacks to "Raramur".
   * @example "Raramur Original", "Raramur: Admire & Create"
   */
  name: String,

  /**
   * Minecraft version on which the server was running.
   * If the save file is present, versions of the save file and the server must match.
   * If the patch version is unknown, replace it with x.
   * @example "1.20.2", "1.14.x", "b1.7.3", "22w19a"
   */
  version: String,

  /**
   * Opening and closing date of the server separated by en dash.
   * @example "01.01.23 – 31.12.23"
   */
  timespan: String,

  /**
   * Link to the save file.
   * @example "https://example.com/raramur_example_1.21.4.zip"
   */
  save: String,

  /**
   * World seed used to generate the server's map.
   * If nullish, the seed is considered unknown.
   * @example "1234567890", "raramur"
   */
  seed: [String, Number]
});

const seedCopied = ref(false);
let seedCopiedTimeout = null;

async function copySeed() {
  if (props.seed === undefined || props.seed === null) {
    return;
  }

  try {
    await navigator.clipboard.writeText(String(props.seed));
  } catch {
    return;
  }

  seedCopied.value = true;
  clearTimeout(seedCopiedTimeout);
  seedCopiedTimeout = setTimeout(() => {
    seedCopied.value = false;
  }, 1500);
}

onUnmounted(() => {
  clearTimeout(seedCopiedTimeout);
});
</script>

<template>
  <div class="timeline-item">
    <div class="timeline-node" aria-hidden="true">
      <div class="timeline-node-inner"></div>
    </div>

    <article class="timeline-card">
      <header class="card-header">
        <div class="card-title-group">
          <h2 class="card-title">{{ name ?? 'Raramur' }}</h2>
          <div class="card-badges">
            <span class="badge-version" title="Версия Minecraft">
              {{ version }}
            </span>
            <span class="badge-timespan" title="Период работы сервера">
              <svg class="badge-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {{ timespan }}
            </span>
          </div>
        </div>

        <div class="card-actions">
          <a v-if="save !== undefined" :href="save" target="_blank" rel="noopener" class="save-link" title="Скачать сохранение сервера">
            <svg class="save-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Скачать мир
          </a>
          <span v-else class="save-unavailable" title="Файл сохранения утерян">
            <svg class="save-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Нет сохранения
          </span>

          <button
            v-if="seed !== undefined && seed !== null"
            type="button"
            class="seed-badge"
            :title="seedCopied ? 'Сид скопирован!' : 'Скопировать сид'"
            @click="copySeed"
          >
            <Transition name="seed-icon" mode="out-in">
              <svg v-if="seedCopied" key="check" class="seed-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <svg v-else key="clipboard" class="seed-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              </svg>
            </Transition>
            <span class="seed-label">Сид: <span class="seed-value">{{ seed }}</span></span>
          </button>
        </div>
      </header>

      <section class="card-content">
        <slot />
      </section>
    </article>
  </div>
</template>

<style scoped>
.timeline-item {
  position: relative;
  margin-bottom: 2.5rem;
}

.timeline-item:last-child {
  margin-bottom: 1rem;
}

.timeline-node {
  position: absolute;
  left: -48px;
  top: 28px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.timeline-node-inner {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #ffffff;
  border: 3.5px solid var(--color-accent);
  box-shadow: 0 0 0 4px rgba(255, 115, 143, 0.18);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease, box-shadow 0.3s ease;
}

.timeline-item:hover .timeline-node-inner {
  transform: scale(1.25);
  border-color: var(--color-accent-alt);
  box-shadow: 0 0 0 6px rgba(255, 121, 77, 0.22);
}

.timeline-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 115, 143, 0.16);
  border-radius: 20px;
  padding: 2rem 2.35rem;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.035), 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.timeline-card:hover {
  border-color: rgba(255, 115, 143, 0.32);
  box-shadow: 0 14px 36px rgba(255, 115, 143, 0.09), 0 2px 6px rgba(0, 0, 0, 0.035);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1.35rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.card-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  min-width: 0;
}

.card-title {
  font-family: var(--font-alt);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-contrast);
  letter-spacing: -0.015em;
  line-height: 1.25;
}

.card-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--font-alt);
}

.badge-version {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.7rem;
  background: rgba(0, 0, 0, 0.045);
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-contrast);
  letter-spacing: 0.02em;
}

.badge-timespan {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem 0.7rem;
  background: rgba(0, 0, 0, 0.025);
  border: 1px solid rgba(0, 0, 0, 0.055);
  border-radius: 9999px;
  font-size: 0.85rem;
  color: var(--black-soft);
}

.badge-icon {
  flex-shrink: 0;
}

.card-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.save-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 1rem;
  background: rgba(0, 168, 107, 0.1);
  border: 1px solid rgba(0, 168, 107, 0.28);
  border-radius: 9999px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #008755;
  text-decoration: none;
  min-width: 0;
  max-width: 100%;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.save-link:hover {
  background: rgba(0, 168, 107, 0.18);
  border-color: #00a86b;
  color: #006842;
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(0, 168, 107, 0.18);
}

.save-link:focus-visible {
  outline: 2px solid #00a86b;
  outline-offset: 2px;
}

.save-unavailable {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.055);
  border-radius: 9999px;
  font-size: 0.85rem;
  color: #8c8c8c;
}

.save-icon {
  flex-shrink: 0;
}

.seed-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 1rem;
  background: rgba(0, 168, 107, 0.1);
  border: 1px solid rgba(0, 168, 107, 0.28);
  border-radius: 9999px;
  font-size: 0.88rem;
  font-weight: 600;
  font-family: inherit;
  color: #008755;
  cursor: pointer;
  min-width: 0;
  max-width: 100%;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.seed-badge:hover {
  background: rgba(0, 168, 107, 0.18);
  border-color: #00a86b;
  color: #006842;
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(0, 168, 107, 0.18);
}

.seed-badge:active {
  transform: translateY(0);
}

.seed-badge:focus-visible {
  outline: 2px solid #00a86b;
  outline-offset: 2px;
}

.seed-icon {
  flex-shrink: 0;
}

.seed-label {
  min-width: 0;
}

.seed-value {
  overflow-wrap: anywhere;
}

.seed-icon-enter-active,
.seed-icon-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.seed-icon-enter-from,
.seed-icon-leave-to {
  opacity: 0;
  transform: scale(0.4);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0;
}

:slotted(.chapter) {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: 2.25rem;
  align-items: center;
  margin: 1.75rem 0;
}

:slotted(.chapter:first-child) {
  margin-top: 0.25rem;
}

:slotted(.chapter:last-child) {
  margin-bottom: 0.25rem;
}

:slotted(.chapter + .chapter) {
  padding-top: 1.75rem;
  border-top: 1px dashed rgba(0, 0, 0, 0.08);
}

:slotted(.story) {
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(49, 49, 49, 0.92);
  text-align: left;
}

:slotted(.story a) {
  color: var(--color-accent);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1.5px solid var(--color-accent-light);
  transition: color 0.2s ease, border-bottom-color 0.2s ease;
}

:slotted(.story a:hover) {
  color: var(--color-accent-alt);
  border-bottom-color: var(--color-accent);
}

@media (max-width: 900px) {
  .timeline-card {
    padding: 1.6rem 1.35rem;
  }

  :slotted(.chapter) {
    grid-template-columns: 1fr;
    gap: 1.35rem;
  }
}

@media (max-width: 768px) {
  .timeline-node {
    left: -32px;
    width: 20px;
    height: 20px;
    top: 24px;
  }

  .timeline-node-inner {
    width: 12px;
    height: 12px;
    border-width: 2.5px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-title {
    font-size: 1.45rem;
  }
}

@media (max-width: 600px) {
  .timeline-node {
    display: none;
  }

  .timeline-card {
    padding: 1.25rem 1rem;
    border-radius: 16px;
  }

  .card-title {
    font-size: 1.25rem;
  }

  .card-actions {
    width: 100%;
  }

  .save-link,
  .save-unavailable,
  .seed-badge {
    flex: 1 1 auto;
    justify-content: center;
    font-size: 0.8rem;
    padding: 0.35rem 0.75rem;
  }

  .badge-version,
  .badge-timespan {
    font-size: 0.78rem;
    padding: 0.15rem 0.55rem;
  }

  :slotted(.story) {
    font-size: 1rem;
    line-height: 1.6;
  }
}
</style>
