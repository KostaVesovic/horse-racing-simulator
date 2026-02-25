<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import RaceAnimation from '../components/RaceAnimation.vue'
import RaceProgram from '../components/RaceProgram.vue'
import CustomButton from '../components/atoms/CustomButton.vue'
import { useAppStore } from '../stores/appStore'

const raceAnimationRef = ref(null)
const appStore = useAppStore()
const router = useRouter()
const { isRunning, isPaused, isCountdownActive, raceCompleted } = storeToRefs(appStore)

const startButtonLabel = computed(() =>
  isRunning.value || isPaused.value || isCountdownActive.value
    ? 'Start New Race'
    : 'Start Race'
)
const pauseButtonLabel = computed(() => (isPaused.value ? 'Continue Race' : 'Pause Race'))
const canTogglePause = computed(
  () => (isRunning.value || isPaused.value) && !isCountdownActive.value
)

const startRace = () => {
  raceAnimationRef.value?.startRace()
}

const togglePause = () => {
  if (isPaused.value) {
    appStore.resumeRace()
    return
  }

  appStore.pauseRace()
}

watch(raceCompleted, (isCompleted) => {
  if (isCompleted) {
    router.push('/results')
  }
})
</script>

<template>
  <section class="game-page">
    <div class="game-page-layout">
      <div class="race-area">
        <div class="action-row">
          <CustomButton @click="startRace">{{ startButtonLabel }}</CustomButton>
          <CustomButton :disabled="!canTogglePause" @click="togglePause">
            {{ pauseButtonLabel }}
          </CustomButton>
        </div>

        <RaceAnimation ref="raceAnimationRef" />
      </div>

      <RaceProgram />
    </div>
  </section>
</template>

<style scoped>
.game-page {
  height: 100vh;
  margin: -24px;
}

.action-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.game-page-layout {
  height: 100%;
  display: flex;
  align-items: stretch;
  justify-content: center;
}

.race-area {
  flex: 1;
  min-width: 0;
  padding: 16px;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .game-page {
    height: auto;
    margin: -24px;
  }

  .game-page-layout {
    flex-direction: column;
  }

  .race-area {
    padding: 16px;
  }
}
</style>
