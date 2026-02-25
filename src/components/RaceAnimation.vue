<script setup>
/**
 * Main race board that renders live lane progress for the active round.
 *
 * @state
 * - currentRound/currentRoundDistance: active round metadata for UI.
 * - laneStates: live lane progress from the app store engine.
 * - isRunning/isCountdownActive/countdownValue: runtime status flags.
 */
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import RaceLaneRow from './RaceLaneRow.vue'
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()
const {
	raceSchedule,
	currentRoundIndex,
	currentRoundLaneStates,
	isRunning,
	isCountdownActive,
	countdownValue
} = storeToRefs(appStore)

const currentRound = computed(() => raceSchedule.value.rounds[currentRoundIndex.value] ?? null)
const currentRoundDistance = computed(() => currentRound.value?.distance ?? 0)
const laneStates = computed(() => currentRoundLaneStates.value)

onMounted(() => {
	appStore.ensureRaceSetup()
})

onBeforeUnmount(() => {
	appStore.stopRaceEngine()
})
</script>

<template>
  <section class="race-animation">
    <header class="race-header">
      <p>Round {{ currentRound?.round ?? 1 }} - {{ currentRoundDistance }}m</p>
    </header>

    <div class="race-board">
      <div class="start-line" />
      <div class="finish-line" />

      <div class="lanes">
        <RaceLaneRow
          v-for="(lane, index) in laneStates"
          :key="`${currentRoundIndex}-${lane.horse.id}-${index}`"
          :lane="lane"
          :is-countdown-active="isCountdownActive"
        />
      </div>

		<div v-if="isCountdownActive" class="round-overlay">
			<div class="overlay-content">
				<p>Next round starting in:</p>
				<span>{{ countdownValue }}</span>
			</div>
		</div>

      <div class="labels-row">
        <span class="start-label">Start</span>
        <span class="finish-label">Finish</span>
      </div>
    </div>

    <footer class="race-meta">
      <span>Status: {{ isRunning ? 'Running' : 'Ready' }}</span>
    </footer>
  </section>
</template>

<style scoped>
.race-animation {
  flex:1;
  min-width: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
}

.race-header h2,
.race-header p {
  margin: 0;
}

.race-header p {
  color: #6b7280;
  font-size: 18px;
  text-align: center;
  margin-bottom: 16px;
}

.race-board {
  position: relative;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #ffffff;
  padding: 16px 14px 30px;
}

.start-line,
.finish-line {
  position: absolute;
  top: 12px;
  bottom: 30px;
  width: 3px;
  border-radius: 999px;
}

.start-line {
  left: 14px;
  background: #16a34a;
}

.finish-line {
  right: 14px;
  background: #dc2626;
}

.lanes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.labels-row {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
}

.round-overlay {
	position: absolute;
	inset: 0;
	background: rgba(17, 24, 39, 0.6);
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 10px;
	z-index: 10;
}

.overlay-content {
	background: #ffffff;
	border-radius: 10px;
	padding: 16px 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	min-width: 250px;
}

.overlay-content p {
	margin: 0;
	font-size: 16px;
	font-weight: 600;
	color: #111827;
}

.overlay-content span {
	font-size: 36px;
	font-weight: 700;
	line-height: 1;
	color: #dc2626;
}

.start-label {
  color: #16a34a;
}

.finish-label {
  color: #dc2626;
}

.race-meta {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
}
</style>