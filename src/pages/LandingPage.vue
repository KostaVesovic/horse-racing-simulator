<script setup>
/**
 * Entry page that introduces the app and routes into the game flow.
 *
 * @state
 * - router: navigation handle for starting a new game.
 */
import HorseAnimation from '../components/atoms/HorseAnimation.vue'
import CustomButton from '../components/atoms/CustomButton.vue'
import { useRouter } from 'vue-router';

const router = useRouter();

const startGame = () => {
  router.push('/game');
}
</script>

<template>
  <section>
    <h1>Horse Race Simulator</h1>
    <div class="horse-stage">
      <HorseAnimation color-name="olive" />
    </div>
    <CustomButton @click="startGame">Generate Program</CustomButton>
  </section>
</template>

<style scoped>
section {
  text-align: center;
  overflow: hidden;
}

.horse-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
}
</style>
