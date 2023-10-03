<script setup>
defineProps(['name', 'version', 'timespan', 'save']);
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