<script setup>
import HorseListItem from './atoms/HorseListItem.vue'
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
  height: 100vh;
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;
}

.title {
  margin: 0 0 16px;
  font-size: 17.6px;
  font-weight: 700;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
