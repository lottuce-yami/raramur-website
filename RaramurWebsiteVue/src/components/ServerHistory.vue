<script setup>
defineProps(['name', 'version', 'timespan', 'save']);
</script>

<template>
  <article>
    <h2>{{name ?? 'Raramur'}}</h2>
    <section>
      <p>{{version}}</p>
      <p>{{timespan}}</p>
      <p>
        <a v-if="save !== undefined" :href="`./saves/${save}.zip`">Сохранение</a>
        <template v-else>Сохранение недоступно</template>
      </p>
    </section>
    <section>
      <slot></slot>
    </section>
  </article>
</template>

<style scoped>

</style>