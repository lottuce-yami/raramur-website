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
   * Filename of the .zip save file without the extension.
   * @example "/saves/raramur_ascended_1.19.2.zip" -> "raramur_ascended_1.19.2"
   */
  save: String
});
</script>

<template>
  <article>
    <h2>{{name ?? 'Raramur'}}</h2>
    <section class="meta">
      <p>{{version}}</p>
      <p>{{timespan}}</p>
      <p class="save">
        <a v-if="save !== undefined" :href="`/saves/${save}.zip`">&#x2713; Сохранение</a>
        <template v-else>&#x2717; Сохранение недоступно</template>
      </p>
    </section>
    <section>
      <slot></slot>
    </section>
  </article>
</template>

<style scoped>
h2, .meta {
  font-family: var(--font-alt);
}

.meta {
  display: flex;
  gap: 1rem;
  font-size: 1.1rem;
}

.save {
  color: var(--color-false);
}

.save a {
  color: var(--color-true);
  text-decoration: underline dotted;
}
.save a:hover {
  text-decoration: underline solid;
}

/*noinspection CssUnusedSymbol*/
:slotted(.chapter) {
  display: flex;
  gap: 2rem;
  margin: .5rem 0;
}

/*noinspection CssUnusedSymbol*/
:slotted(.story) {
  flex: 1;
  text-align: justify;
  font-size: 1.25rem;
}

/*noinspection CssUnusedSymbol*/
:slotted(.images) {
  flex: 1;
  padding: 0;
}

:deep(.no-cover) {
  background-size: contain;
  background-repeat: no-repeat;
}
</style>