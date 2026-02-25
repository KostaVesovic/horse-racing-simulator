<script setup>
/**
 * Round-by-round program panel with distances and placements.
 *
 * @state
 * - rounds: derived schedule rounds rendered as result tiles.
 * - actions slot: optional header actions injected by parent pages.
 */
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()
const { raceSchedule } = storeToRefs(appStore)

const rounds = computed(() => raceSchedule.value.rounds ?? [])

onMounted(() => {
  appStore.ensureRaceSetup()
})
</script>

<template>
  <div class="race-program">
    <div class="program-header">
      <h2 class="title">Race Program</h2>
      <div class="program-actions">
        <slot name="actions" />
      </div>
    </div>
    <div class="round-grid">
      <section
        v-for="round in rounds"
        :key="round.round"
        class="round-card"
        :class="{ 'is-completed': round.isCompleted }"
        :data-testid="round.isCompleted ? 'round-card-completed' : 'round-card'"
      >
        <header class="round-header">
          <h3>Round {{ round.round }}</h3>
          <p>{{ round.distance }}m</p>
        </header>
        <ul class="horse-list">
          <li v-for="horse in round.horses" :key="`${round.round}-${horse.id}`" class="horse-item">
            <span class="swatch" :style="{ backgroundColor: horse.hex }" />
            <span class="name">{{ horse.name }}</span>
            <span class="condition">Condition: {{ horse.condition }}</span>
            <span class="place" data-testid="round-place">Place: {{ horse.finishPosition ?? '-' }}</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.race-program {
  flex: 0 0 280px;
  height: 100vh;
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;
  background: #ffffff;
}

.title {
  font-size: 17.6px;
  font-weight: 700;
}

.program-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 0 0 16px;
}

.program-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

h2 {
  margin: 0;
}

.round-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 14.4px;
}

.round-card {
  flex: 1;
  min-width: 220px;
  border: 1px solid #e5e7eb;
  border-radius: 9.6px;
  padding: 12px;
  background: #ffffff;
}

.round-card.is-completed {
  border: 2px solid #dc2626;
}

.round-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10.4px;
}

.round-header h3,
.round-header p {
  margin: 0;
}

.round-header p {
  color: #6b7280;
  font-size: 13.6px;
}

.horse-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.horse-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  flex-shrink: 0;
}

.name {
  font-size: 13.92px;
}

.condition {
  color: #6b7280;
  font-size: 12.48px;
}

.place {
  margin-left: auto;
  color: #1f2937;
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 1200px) {
  .round-card {
    flex-basis: calc(50% - 7.2px);
  }
}

@media (max-width: 768px) {
  .race-program {
    flex-basis: auto;
    width: 100%;
  }

  .round-card {
    flex-basis: 200px;
  }
}
</style>