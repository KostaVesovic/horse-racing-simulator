<script setup>
import { useRouter } from 'vue-router'
import RaceProgram from '../components/RaceProgram.vue'
import CustomButton from '../components/atoms/CustomButton.vue'

const router = useRouter()

const goToStart = () => {
  router.push('/')
}
</script>

<template>
  <section class="results-page">
    <CustomButton class="back-button" @click="goToStart">
      Back to Start
    </CustomButton>
    <RaceProgram />
  </section>
</template>

<style scoped>
.results-page {
  position: relative;
}

.back-button {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 5;
}
</style>
