import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAppStore } from './appStore'

const createHorse = (id, condition = 100) => ({
  id,
  name: `Horse ${id}`,
  color: 'olive',
  hex: '#6b705c',
  condition,
  finishPosition: null
})

const createRound = (round, distance, horses) => ({
  round,
  distance,
  isCompleted: false,
  horses
})

describe('appStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('startRace + completion flow', () => {
    it('completes a single-round race and marks final results', () => {
      const store = useAppStore()
      store.raceSchedule = {
        rounds: [
          createRound(1, 100, [createHorse('h1', 120)])
        ],
        totalRounds: 1,
        generatedAt: Date.now()
      }

      store.startRace()
      expect(store.isRunning).toBe(true)
      expect(store.raceCompleted).toBe(false)

      vi.advanceTimersByTime(300)

      expect(store.isRunning).toBe(false)
      expect(store.raceCompleted).toBe(true)
      expect(store.raceSchedule.rounds[0].isCompleted).toBe(true)
      expect(store.raceSchedule.rounds[0].horses[0].finishPosition).toBe(1)
    })
  })

  describe('multi-round transitions', () => {
    it('moves through delay + countdown before starting next round', () => {
      const store = useAppStore()
      store.raceSchedule = {
        rounds: [
          createRound(1, 100, [createHorse('h1', 120)]),
          createRound(2, 100, [createHorse('h2', 120)])
        ],
        totalRounds: 2,
        generatedAt: Date.now()
      }

      store.startRace()
      vi.advanceTimersByTime(300)

      expect(store.currentRoundIndex).toBe(0)
      expect(store.raceSchedule.rounds[0].isCompleted).toBe(true)
      expect(store.isCountdownActive).toBe(false)

      vi.advanceTimersByTime(1500)
      expect(store.currentRoundIndex).toBe(1)
      expect(store.isCountdownActive).toBe(true)
      expect(store.countdownValue).toBe(3)

      vi.advanceTimersByTime(1000)
      expect(store.countdownValue).toBe(2)
      vi.advanceTimersByTime(1000)
      expect(store.countdownValue).toBe(1)
      vi.advanceTimersByTime(1000)

      expect(store.isCountdownActive).toBe(false)
      expect(store.isRunning).toBe(true)

      vi.advanceTimersByTime(300)
      expect(store.raceCompleted).toBe(true)
      expect(store.raceSchedule.rounds[1].isCompleted).toBe(true)
    })
  })

  describe('pause and resume', () => {
    it('pauses ticking and resumes from current progress', () => {
      const store = useAppStore()
      store.raceSchedule = {
        rounds: [
          createRound(1, 1000, [createHorse('h1', 100)])
        ],
        totalRounds: 1,
        generatedAt: Date.now()
      }

      store.startRace()
      vi.advanceTimersByTime(300)
      const distanceAfterFirstTick = store.currentRoundLaneStates[0].distanceCovered
      expect(distanceAfterFirstTick).toBe(100)

      store.pauseRace()
      expect(store.isPaused).toBe(true)
      expect(store.isRunning).toBe(false)

      vi.advanceTimersByTime(3000)
      expect(store.currentRoundLaneStates[0].distanceCovered).toBe(distanceAfterFirstTick)

      store.resumeRace()
      expect(store.isRunning).toBe(true)
      expect(store.isPaused).toBe(false)

      vi.advanceTimersByTime(300)
      expect(store.currentRoundLaneStates[0].distanceCovered).toBe(200)
    })
  })

  describe('resetResultsAndGenerateRounds', () => {
    it('resets completion flags and regenerates schedule metadata', () => {
      const store = useAppStore()
      store.horses = Array.from({ length: 10 }, (_, index) =>
        createHorse(`h${index + 1}`, 70 + index)
      )
      store.raceCompleted = true
      store.raceSchedule = {
        rounds: [
          createRound(1, 1200, store.horses.slice(0, 10).map((horse, index) => ({
            ...horse,
            finishPosition: index + 1
          })))
        ],
        totalRounds: 1,
        generatedAt: 1
      }

      store.resetResultsAndGenerateRounds()

      expect(store.raceCompleted).toBe(false)
      expect(store.currentRoundIndex).toBe(0)
      expect(store.raceSchedule.totalRounds).toBe(6)
      expect(store.raceSchedule.rounds).toHaveLength(6)
      expect(store.raceSchedule.rounds.every((round) => round.isCompleted === false)).toBe(true)
    })
  })
})
