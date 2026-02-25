<script setup>
import { onMounted } from 'vue'
import HorseList from './components/HorseList.vue'
import { useAppStore } from './stores/appStore'

const appStore = useAppStore()

onMounted(() => {
  appStore.generateHorseList()
})
</script>

<template>
  <div class="app-layout">
    <aside class="app-sidebar">
      <HorseList />
    </aside>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100%;
  display: flex;
  background: #f5f5f4;
}

.app-sidebar {
  width: 280px;
  flex: 0 0 280px;
  border-right: 1px solid #d4d4d4;
  background: #ffffff;
}

.app-main {
  flex: 1;
  min-width: 0;
  padding: 24px;
}

@media (max-width: 900px) {
  .app-layout {
    flex-direction: column;
  }

  .app-sidebar {
    width: 100%;
    flex-basis: auto;
    border-right: none;
    border-bottom: 1px solid #d4d4d4;
  }
}
</style>

<style>
html,
body,
#app {
  height: 100%;
}

body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
}
</style>
