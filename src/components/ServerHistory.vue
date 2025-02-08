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
  <article class="server-entry">
    <h2 class="server-entry-heading">{{ name ?? 'Raramur' }}</h2>
    <section class="server-entry-meta">
      <span class="server-entry-version">{{ version }}</span>
      <span class="server-entry-timespan">{{ timespan }}</span>
      <span class="server-entry-save">
        <a v-if="save !== undefined" :href=save target="_blank" class="server-entry-save-link">&#x2713; Сохранение</a>
        <template v-else>&#x2717; Сохранение недоступно</template>
      </span>
    </section>
    <section class="server-entry-content">
      <slot/>
    </section>
  </article>
</template>

<style scoped>
.server-entry-heading, .server-entry-meta {
  font-family: var(--font-alt);
}

.server-entry-meta {
  display: flex;
  gap: 1rem;
  font-size: 1.1rem;
}

.server-entry-save {
  color: var(--color-false);
}

.server-entry-save-link {
  color: var(--color-true);
  text-decoration: underline dotted;
}
.server-entry-save-link:hover {
  text-decoration: underline solid;
}

:slotted(.chapter) {
  display: flex;
  gap: 2rem;
  margin: .5rem 0;
}

:slotted(.story) {
  flex: 1;
  text-align: justify;
  font-size: 1.25rem;
}

:slotted(.images) {
  flex: 1;
  padding: 0;
}

:deep(.no-cover) {
  background-size: contain;
  background-repeat: no-repeat;
}
</style>