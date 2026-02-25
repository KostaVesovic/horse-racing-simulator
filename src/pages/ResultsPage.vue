<script setup>
/**
 * Results screen showing final race program outcomes.
 *
 * @state
 * - router: navigation back to landing.
 * - appStore: reset action before leaving results.
 */
import { useRouter } from 'vue-router'
import RaceProgram from '../components/RaceProgram.vue'
import CustomButton from '../components/atoms/CustomButton.vue'
import { useAppStore } from '../stores/appStore'

const router = useRouter()
const appStore = useAppStore()

const goToStart = () => {
  appStore.resetResultsAndGenerateRounds()
  router.push('/')
}
</script>

<template>
  <section>
    <RaceProgram>
      <template #actions>
        <CustomButton @click="goToStart">Back to Start</CustomButton>
      </template>
    </RaceProgram>
  </section>
</template>
