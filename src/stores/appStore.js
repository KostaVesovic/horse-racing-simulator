import { defineStore } from 'pinia'
import { ref } from 'vue'
import { HORSE_COLORS } from '../constants/horseColors'
import {
  createRaceSchedule,
  generateHorseListFromColors
} from '../helpers/raceData'
import {
  advanceRoundTick,
  createRoundLaneStates,
  finalizeRoundWithPlacements,
  resetScheduleRoundResults
} from '../helpers/raceEngine'

const ROUND_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200]
const HORSES_PER_ROUND = 10
const TICK_MS = 300
const NEXT_ROUND_DELAY_MS = 1500
const DEFAULT_ROUND_INDEX = 0

export const useAppStore = defineStore('app', () => {
  // Main race data used across pages.
  const horses = ref([])
  const raceSchedule = ref({
    rounds: [],
    totalRounds: ROUND_DISTANCES.length,
    generatedAt: null
  })
  // Live race status while a race is running.
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

  // Build a fresh horse pool from predefined colors.
  const generateHorseList = () => {
    horses.value = generateHorseListFromColors(HORSE_COLORS)
  }

  // Small helpers to safely clear active timers.
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

  // Reset runtime flags between flows; optionally clear "race complete".
  const resetRaceRuntimeState = ({ resetCompletion = false } = {}) => {
    clearAllRaceTimers()
    isRunning.value = false
    isPaused.value = false
    isCountdownActive.value = false
    countdownValue.value = 3

    if (resetCompletion) {
      raceCompleted.value = false
    }
  }

  // Initialize lane progress for a specific round.
  const prepareRoundLanes = (roundIndex = currentRoundIndex.value) => {
    const round = raceSchedule.value.rounds[roundIndex]
    currentRoundLaneStates.value = createRoundLaneStates(round)
  }

  // Write lane finish positions back into schedule results.
  const finalizeRoundResults = () => {
    const round = raceSchedule.value.rounds[currentRoundIndex.value]
    if (!round) {
      return
    }

    const updatedRound = finalizeRoundWithPlacements(
      round,
      currentRoundLaneStates.value
    )

    const updatedRounds = [...raceSchedule.value.rounds]
    updatedRounds[currentRoundIndex.value] = updatedRound
    raceSchedule.value = {
      ...raceSchedule.value,
      rounds: updatedRounds
    }
  }

  // Run one simulation tick; finish the round when everyone is done.
  const runRoundTick = () => {
    const round = raceSchedule.value.rounds[currentRoundIndex.value]
    const roundDistance = round?.distance ?? 0
    if (!roundDistance) {
      clearRaceTimer()
      isRunning.value = false
      isPaused.value = false
      return
    }

    const { updatedLaneStates, allFinished } = advanceRoundTick(
      currentRoundLaneStates.value,
      roundDistance
    )
    currentRoundLaneStates.value = updatedLaneStates

    if (allFinished) {
      clearRaceTimer()
      isRunning.value = false
      isPaused.value = false
      finalizeRoundResults()
      scheduleNextRound()
    }
  }

  // Start ticking the current round.
  const startRound = () => {
    if (isRunning.value || isCountdownActive.value) {
      return
    }

    isRunning.value = true
    isPaused.value = false
    raceTimerId = setInterval(runRoundTick, TICK_MS)
  }

  // Wait, show countdown, then move into the next round.
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

  // Keep the same round rosters, but clear completion/results.
  const resetRaceProgress = () => {
    const resetRounds = resetScheduleRoundResults(raceSchedule.value.rounds)

    raceSchedule.value = {
      ...raceSchedule.value,
      rounds: resetRounds
    }
  }

  // Generate a brand-new race schedule and prepare round 1 lanes.
  const generateRaceSchedule = () => {
    if (!horses.value.length) {
      generateHorseList()
    }

    resetRaceRuntimeState({ resetCompletion: true })

    raceSchedule.value = createRaceSchedule({
      distances: ROUND_DISTANCES,
      horsesPerRound: HORSES_PER_ROUND,
      horses: horses.value
    })

    currentRoundIndex.value = DEFAULT_ROUND_INDEX
    prepareRoundLanes(DEFAULT_ROUND_INDEX)
  }

  // Results page uses this to start fresh when going back.
  const resetResultsAndGenerateRounds = () => {
    generateRaceSchedule()
  }

  // Make sure required schedule/lane state exists before actions run.
  const ensureRaceSetup = () => {
    if (!raceSchedule.value.rounds.length) {
      generateRaceSchedule()
      return
    }

    if (!currentRoundLaneStates.value.length) {
      prepareRoundLanes(currentRoundIndex.value)
    }
  }

  // Public entrypoint: start race from round 1.
  const startRace = () => {
    ensureRaceSetup()
    resetRaceRuntimeState({ resetCompletion: true })
    currentRoundIndex.value = DEFAULT_ROUND_INDEX
    resetRaceProgress()
    prepareRoundLanes(DEFAULT_ROUND_INDEX)
    startRound()
  }

  const stopRaceEngine = () => {
    resetRaceRuntimeState()
  }

  // Pause active ticking; countdown flow is controlled separately.
  const pauseRace = () => {
    if (!isRunning.value || isCountdownActive.value) {
      return
    }

    clearRaceTimer()
    isRunning.value = false
    isPaused.value = true
  }

  // Resume only if current round still has unfinished lanes.
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
    resetResultsAndGenerateRounds,
    resetRaceRuntimeState,
    ensureRaceSetup,
    startRace,
    stopRaceEngine,
    pauseRace,
    resumeRace
  }
})
