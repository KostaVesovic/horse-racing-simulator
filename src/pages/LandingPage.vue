<script setup>
import HorseAnimation from '../components/HorseAnimation.vue'
import { useRouter } from 'vue-router';

const router = useRouter();

const startGame = () => {
  router.push('/game');
}
</script>

<template>
  <section class="page">
    <h1>Horse Race Simulator</h1>
    <div class="horse-stage">
      <HorseAnimation color-name="olive" />
    </div>
    <button @click="startGame">Generate Program</button>
  </section>
</template>

<style scoped>
.horse-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
}


</style>
