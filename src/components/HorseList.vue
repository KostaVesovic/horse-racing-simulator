<script setup>
import HorseListItem from './HorseListItem.vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()
const { horses } = storeToRefs(appStore)
</script>

<template>
  <section class="horse-list">
    <h2 class="title">Horse List</h2>
    <ul class="list">
      <HorseListItem v-for="horse in horses" :key="horse.id" :horse="horse" />
    </ul>
  </section>
</template>

<style scoped>
.horse-list {
  padding: 1rem;
}

.title {
  margin: 0 0 1rem;
  font-size: 1.1rem;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}
</style>
