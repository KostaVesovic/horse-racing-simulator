<script setup>
/**
 * One race lane row with moving horse visuals and finish badge.
 *
 * @props
 * - lane: lane runtime object (horse, progress, finishPosition).
 * - isCountdownActive: disables transition while lanes reset.
 * @state
 * - normalizedProgress: clamped progress used for safe positioning.
 */
import { computed } from 'vue'
import HorseAnimation from './atoms/HorseAnimation.vue'

const props = defineProps({
  lane: {
    type: Object,
    required: true,
    validator: (lane) => {
      return !!lane?.horse?.name &&
        !!lane?.horse?.color &&
        typeof lane?.progress === 'number'
    }
  },
  isCountdownActive: {
    type: Boolean,
    default: false
  }
})

const normalizedProgress = computed(() => {
  const progress = props.lane.progress
  return Math.max(0, Math.min(1, progress))
})

const laneRunnerStyle = computed(() => ({
  left: `${normalizedProgress.value * 100}%`,
  transform: `translateX(-${normalizedProgress.value * 100}%)`,
  transition: props.isCountdownActive ? 'none' : 'left 450ms linear, transform 450ms linear'
}))
</script>

<template>
	<div class="lane-row">
		<div class="horse-runner" :style="laneRunnerStyle">
			<span v-if="lane.finishPosition" class="finish-order">{{ lane.finishPosition }}</span>
			<HorseAnimation v-else :color-name="lane.horse.color" size="small" />
		</div>
		<span class="lane-name">{{ lane.horse.name }}</span>
	</div>
</template>

<style scoped>
.lane-row {
	position: relative;
	height: 66px;
	border-bottom: 1px dashed #e5e7eb;
	overflow: hidden;
}

.horse-runner {
	position: absolute;
	top: 5px;
	left: 0;
}

.lane-name {
	position: absolute;
	left: 4px;
	bottom: 2px;
	font-size: 11px;
	color: #4b5563;
	line-height: 1;
}

.finish-order {
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 999px;
	background: #111827;
	color: #ffffff;
	font-size: 18px;
	font-weight: 700;
	line-height: 1;
}
</style>
