<script setup>
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
  save: String
});
</script>

<template>
  <div class="timeline-item">
    <!-- Timeline Node on the Spine Rail -->
    <div class="timeline-node" aria-hidden="true">
      <div class="timeline-node-inner"></div>
    </div>

    <!-- Elevated Season Card -->
    <article class="timeline-card">
      <header class="card-header">
        <div class="card-title-group">
          <h2 class="card-title">{{ name ?? 'Raramur' }}</h2>
          <div class="card-badges">
            <span class="badge-version" title="Версия Minecraft">
              {{ version }}
            </span>
            <span class="badge-timespan" title="Период работы сервера">
              <svg class="badge-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <svg class="save-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Скачать мир
          </a>
          <span v-else class="save-unavailable" title="Файл сохранения утерян">
            <svg class="save-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Нет сохранения
          </span>
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
  margin-bottom: 2.75rem;
}

.timeline-item:last-child {
  margin-bottom: 1rem;
}

/* Timeline Node on Spine */
.timeline-node {
  position: absolute;
  left: -48px;
  top: 26px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.timeline-node-inner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  border: 3.5px solid var(--color-accent);
  box-shadow: 0 0 0 4px rgba(255, 115, 143, 0.2);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.timeline-item:hover .timeline-node-inner {
  transform: scale(1.3);
  border-color: var(--color-accent-alt);
  box-shadow: 0 0 0 6px rgba(255, 121, 77, 0.3);
}

/* Elevated Timeline Card */
.timeline-card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 115, 143, 0.18);
  border-radius: 20px;
  padding: 2.25rem 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
}

.timeline-card:hover {
  border-color: rgba(255, 115, 143, 0.35);
  box-shadow: 0 16px 40px rgba(255, 115, 143, 0.1), 0 2px 6px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

/* Card Header */
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1.5rem;
  margin-bottom: 1.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

.card-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-title {
  font-family: var(--font-alt);
  font-size: 1.85rem;
  font-weight: 700;
  color: var(--color-contrast);
  letter-spacing: -0.01em;
}

.card-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-alt);
}

.badge-version {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.7rem;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.08);
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
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.06);
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
}

.save-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 1rem;
  background: rgba(0, 168, 107, 0.1);
  border: 1px solid rgba(0, 168, 107, 0.3);
  border-radius: 9999px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #008755;
  text-decoration: none;
  transition: all 0.2s ease;
}

.save-link:hover {
  background: rgba(0, 168, 107, 0.2);
  border-color: #00a86b;
  color: #006842;
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(0, 168, 107, 0.2);
}

.save-unavailable {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 9999px;
  font-size: 0.85rem;
  color: #8c8c8c;
}

.save-icon {
  flex-shrink: 0;
}

/* Card Chapters */
:slotted(.chapter) {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 2.5rem;
  align-items: center;
  margin: 2rem 0;
}

:slotted(.chapter:first-child) {
  margin-top: 0.5rem;
}

:slotted(.chapter:last-child) {
  margin-bottom: 0.5rem;
}

:slotted(.chapter + .chapter) {
  padding-top: 2rem;
  border-top: 1px dashed rgba(0, 0, 0, 0.08);
}

:slotted(.story) {
  font-size: 1.12rem;
  line-height: 1.7;
  color: rgba(49, 49, 49, 0.92);
  text-align: left;
}

:slotted(.story a) {
  color: var(--color-accent);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1.5px solid var(--color-accent-light);
  transition: all 0.2s ease;
}

:slotted(.story a:hover) {
  color: var(--color-accent-alt);
  border-bottom-color: var(--color-accent);
}

/* Standardized Carousels */
:slotted(.images) {
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
  background: #181818;
  border: 1px solid rgba(0, 0, 0, 0.08);
  cursor: zoom-in;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

:slotted(.images:hover) {
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.13), 0 2px 6px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

:deep(.contain-image .vueperslide__image) {
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
}

:deep(.no-cover) {
  background-size: contain;
  background-repeat: no-repeat;
}

/* Polished VueperSlides Controls */
:deep(.vueperslides__arrow) {
  color: #ffffff;
  opacity: 0.8;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

:deep(.vueperslides__arrow:hover) {
  opacity: 1;
  transform: scale(1.1);
}

:deep(.vueperslides__arrow svg) {
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.7));
  width: 2.2rem;
}

:deep(.vueperslides__bullet) {
  margin: 0 4px;
}

:deep(.vueperslides__bullet .default) {
  background-color: rgba(255, 255, 255, 0.45);
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  transition: all 0.25s ease;
  width: 8px;
  height: 8px;
}

:deep(.vueperslides__bullet--active .default) {
  background-color: var(--color-accent);
  transform: scale(1.35);
}

@media (max-width: 900px) {
  .timeline-card {
    padding: 1.75rem 1.5rem;
  }
  
  :slotted(.chapter) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .timeline-node {
    left: -32px;
    width: 20px;
    height: 20px;
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
}
</style>