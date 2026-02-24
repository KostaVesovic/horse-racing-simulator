import { defineStore } from 'pinia'
import { ref } from 'vue'
import { HORSE_COLORS } from '../constants/horseColors'

export const useAppStore = defineStore('app', () => {
  const horses = ref([])

  const generateRandomCondition = () => {
    return Math.floor(Math.random() * 51) + 50
  }

  const shuffleColors = () => {
    const pool = [...HORSE_COLORS]

    for (let i = pool.length - 1; i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1))
      const temp = pool[i]
      pool[i] = pool[randomIndex]
      pool[randomIndex] = temp
    }

    return pool
  }

  const generateHorseList = () => {
    const randomColors = shuffleColors()

    horses.value = randomColors.map((color, index) => ({
      id: `${Date.now()}-${index}`,
      name: `Horse ${index + 1}`,
      color: color.name,
      hex: color.hex,
      condition: generateRandomCondition()
    }))
  }

  return {
    horses,
    generateHorseList
  }
})
