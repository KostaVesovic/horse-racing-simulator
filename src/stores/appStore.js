import { defineStore } from 'pinia'
import { ref } from 'vue'
import { HORSE_COLORS } from '../constants/horseColors'

const ROUND_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200]
const HORSES_PER_ROUND = 10
const TICK_MS = 300
const NEXT_ROUND_DELAY_MS = 1500
const DEFAULT_ROUND_INDEX = 0

export const useAppStore = defineStore('app', () => {
  const horses = ref([])
  const raceSchedule = ref({
    rounds: [],
    totalRounds: ROUND_DISTANCES.length,
    generatedAt: null
  })
  const currentRoundIndex = ref(DEFAULT_ROUND_INDEX)
  const currentRoundLaneStates = ref([])
  const isRunning = ref(false)
  const isPaused = ref(false)
  const isCountdownActive = ref(false)
  const countdownValue = ref(3)
  const raceCompleted = ref(false)

  let raceTimerId = null
  let countdownTimerId = null
  let roundDelayTimerId = null

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

  const pickRandomHorses = () => {
    const pool = [...horses.value]

    for (let i = pool.length - 1; i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1))
      const temp = pool[i]
      pool[i] = pool[randomIndex]
      pool[randomIndex] = temp
    }

    return pool.slice(0, Math.min(HORSES_PER_ROUND, pool.length))
  }

  const clearRaceTimer = () => {
    if (raceTimerId) {
      clearInterval(raceTimerId)
      raceTimerId = null
    }
  }

  const clearCountdownTimer = () => {
    if (countdownTimerId) {
      clearInterval(countdownTimerId)
      countdownTimerId = null
    }
  }

  const clearRoundDelayTimer = () => {
    if (roundDelayTimerId) {
      clearTimeout(roundDelayTimerId)
      roundDelayTimerId = null
    }
  }

  const clearAllRaceTimers = () => {
    clearRaceTimer()
    clearCountdownTimer()
    clearRoundDelayTimer()
  }

  const prepareRoundLanes = (roundIndex = currentRoundIndex.value) => {
    const round = raceSchedule.value.rounds[roundIndex]
    if (!round) {
      currentRoundLaneStates.value = []
      return
    }

    currentRoundLaneStates.value = round.horses.map((horse) => ({
      horse,
      distanceCovered: 0,
      progress: 0,
      finishPosition: null
    }))
  }

  const finalizeRoundResults = () => {
    const round = raceSchedule.value.rounds[currentRoundIndex.value]
    if (!round) {
      return
    }

    const finishPositionByHorseId = new Map(
      currentRoundLaneStates.value.map((lane) => [lane.horse.id, lane.finishPosition])
    )

    const updatedRound = {
      ...round,
      isCompleted: true,
      horses: round.horses.map((horse) => ({
        ...horse,
        finishPosition: finishPositionByHorseId.get(horse.id) ?? null
      }))
    }

    const updatedRounds = [...raceSchedule.value.rounds]
    updatedRounds[currentRoundIndex.value] = updatedRound
    raceSchedule.value = {
      ...raceSchedule.value,
      rounds: updatedRounds
    }
  }

  const runRoundTick = () => {
    const round = raceSchedule.value.rounds[currentRoundIndex.value]
    const roundDistance = round?.distance ?? 0
    if (!roundDistance) {
      clearRaceTimer()
      isRunning.value = false
      isPaused.value = false
      return
    }

    let nextFinishPosition = currentRoundLaneStates.value.filter(
      (lane) => lane.finishPosition !== null
    ).length

    currentRoundLaneStates.value = currentRoundLaneStates.value.map((lane) => {
      const nextDistance = Math.min(
        lane.distanceCovered + lane.horse.condition,
        roundDistance
      )
      const hasFinished = lane.finishPosition !== null
      const justFinished = !hasFinished && nextDistance >= roundDistance

      if (justFinished) {
        nextFinishPosition += 1
      }

      return {
        ...lane,
        distanceCovered: nextDistance,
        progress: nextDistance / roundDistance,
        finishPosition: justFinished ? nextFinishPosition : lane.finishPosition
      }
    })

    const allFinished = currentRoundLaneStates.value.every(
      (lane) => lane.progress >= 1
    )

    if (allFinished) {
      clearRaceTimer()
      isRunning.value = false
      isPaused.value = false
      finalizeRoundResults()
      scheduleNextRound()
    }
  }

  const startRound = () => {
    if (isRunning.value || isCountdownActive.value) {
      return
    }

    isRunning.value = true
    isPaused.value = false
    raceTimerId = setInterval(runRoundTick, TICK_MS)
  }

  const scheduleNextRound = () => {
    const hasNextRound =
      currentRoundIndex.value < raceSchedule.value.rounds.length - 1

    if (!hasNextRound) {
      raceCompleted.value = true
      return
    }

    clearCountdownTimer()
    clearRoundDelayTimer()

    roundDelayTimerId = setTimeout(() => {
      const nextRoundIndex = currentRoundIndex.value + 1
      currentRoundIndex.value = nextRoundIndex
      prepareRoundLanes(nextRoundIndex)

      isCountdownActive.value = true
      countdownValue.value = 3

      countdownTimerId = setInterval(() => {
        if (countdownValue.value > 1) {
          countdownValue.value -= 1
          return
        }

        clearCountdownTimer()
        isCountdownActive.value = false
        startRound()
      }, 1000)
    }, NEXT_ROUND_DELAY_MS)
  }

  const resetRaceProgress = () => {
    const resetRounds = raceSchedule.value.rounds.map((round) => ({
      ...round,
      isCompleted: false,
      horses: round.horses.map((horse) => ({
        ...horse,
        finishPosition: null
      }))
    }))

    raceSchedule.value = {
      ...raceSchedule.value,
      rounds: resetRounds
    }
  }

  const generateRaceSchedule = () => {
    if (!horses.value.length) {
      generateHorseList()
    }

    raceSchedule.value = {
      rounds: ROUND_DISTANCES.map((distance, index) => ({
        round: index + 1,
        distance,
        isCompleted: false,
        horses: pickRandomHorses().map((horse) => ({
          ...horse,
          finishPosition: null
        }))
      })),
      totalRounds: ROUND_DISTANCES.length,
      generatedAt: Date.now()
    }

    currentRoundIndex.value = DEFAULT_ROUND_INDEX
    prepareRoundLanes(DEFAULT_ROUND_INDEX)
  }

  const ensureRaceSetup = () => {
    if (!raceSchedule.value.rounds.length) {
      generateRaceSchedule()
      return
    }

    if (!currentRoundLaneStates.value.length) {
      prepareRoundLanes(currentRoundIndex.value)
    }
  }

  const startRace = () => {
    ensureRaceSetup()
    clearAllRaceTimers()
    isRunning.value = false
    isPaused.value = false
    isCountdownActive.value = false
    countdownValue.value = 3
    raceCompleted.value = false
    currentRoundIndex.value = DEFAULT_ROUND_INDEX
    resetRaceProgress()
    prepareRoundLanes(DEFAULT_ROUND_INDEX)
    startRound()
  }

  const stopRaceEngine = () => {
    clearAllRaceTimers()
    isRunning.value = false
    isPaused.value = false
    isCountdownActive.value = false
  }

  const pauseRace = () => {
    if (!isRunning.value || isCountdownActive.value) {
      return
    }

    clearRaceTimer()
    isRunning.value = false
    isPaused.value = true
  }

  const resumeRace = () => {
    if (!isPaused.value || isCountdownActive.value || !currentRoundLaneStates.value.length) {
      return
    }

    const hasUnfinishedHorse = currentRoundLaneStates.value.some(
      (lane) => lane.progress < 1
    )

    if (!hasUnfinishedHorse) {
      isPaused.value = false
      return
    }

    startRound()
  }

  return {
    horses,
    raceSchedule,
    currentRoundIndex,
    currentRoundLaneStates,
    isRunning,
    isPaused,
    isCountdownActive,
    countdownValue,
    raceCompleted,
    generateHorseList,
    generateRaceSchedule,
    ensureRaceSetup,
    startRace,
    stopRaceEngine,
    pauseRace,
    resumeRace
  }
})
