// Returns a horse condition in the 50-100 range.
export const generateRandomCondition = () => {
  return Math.floor(Math.random() * 51) + 50
}

// Fisher-Yates shuffle used for fair random ordering.
export const shuffleArray = (items) => {
  const pool = [...items]

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    const temp = pool[i]
    pool[i] = pool[randomIndex]
    pool[randomIndex] = temp
  }

  return pool
}

// Builds horse objects from color constants.
export const generateHorseListFromColors = (horseColors) => {
  const randomColors = shuffleArray(horseColors)

  return randomColors.map((color, index) => ({
    id: `${Date.now()}-${index}`,
    name: `Horse ${index + 1}`,
    color: color.name,
    hex: color.hex,
    condition: generateRandomCondition()
  }))
}

// Picks up to "count" random entries from a list.
export const pickRandomEntries = (items, count) => {
  const shuffled = shuffleArray(items)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

// Creates all round definitions with assigned horses.
export const createRaceSchedule = ({
  distances,
  horsesPerRound,
  horses
}) => {
  return {
    rounds: distances.map((distance, index) => ({
      round: index + 1,
      distance,
      isCompleted: false,
      horses: pickRandomEntries(horses, horsesPerRound).map((horse) => ({
        ...horse,
        finishPosition: null
      }))
    })),
    totalRounds: distances.length,
    generatedAt: Date.now()
  }
}
