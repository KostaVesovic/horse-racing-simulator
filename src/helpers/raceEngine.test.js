import {
  advanceRoundTick,
  createRoundLaneStates,
  finalizeRoundWithPlacements,
  resetScheduleRoundResults
} from './raceEngine'

describe('raceEngine helpers', () => {
  describe('createRoundLaneStates', () => {
    it('returns empty array when round is missing', () => {
      expect(createRoundLaneStates()).toEqual([])
      expect(createRoundLaneStates(null)).toEqual([])
    })

    it('builds lane state objects from round horses', () => {
      const round = {
        horses: [
          { id: 'h1', name: 'Horse 1', condition: 80 },
          { id: 'h2', name: 'Horse 2', condition: 75 }
        ]
      }

      const lanes = createRoundLaneStates(round)

      expect(lanes).toHaveLength(2)
      expect(lanes[0]).toMatchObject({
        horse: round.horses[0],
        distanceCovered: 0,
        progress: 0,
        finishPosition: null
      })
    })
  })

  describe('finalizeRoundWithPlacements', () => {
    it('writes lane finish positions into round horses', () => {
      const round = {
        round: 1,
        isCompleted: false,
        horses: [
          { id: 'h1', name: 'Horse 1', finishPosition: null },
          { id: 'h2', name: 'Horse 2', finishPosition: null }
        ]
      }

      const laneStates = [
        { horse: { id: 'h1' }, finishPosition: 2 },
        { horse: { id: 'h2' }, finishPosition: 1 }
      ]

      const updated = finalizeRoundWithPlacements(round, laneStates)

      expect(updated.isCompleted).toBe(true)
      expect(updated.horses.find((horse) => horse.id === 'h1')?.finishPosition).toBe(2)
      expect(updated.horses.find((horse) => horse.id === 'h2')?.finishPosition).toBe(1)
    })
  })

  describe('advanceRoundTick', () => {
    it('advances distance/progress and assigns finish positions', () => {
      const laneStates = [
        {
          horse: { id: 'h1', condition: 100 },
          distanceCovered: 60,
          progress: 0.6,
          finishPosition: null
        },
        {
          horse: { id: 'h2', condition: 50 },
          distanceCovered: 20,
          progress: 0.2,
          finishPosition: null
        }
      ]

      const { updatedLaneStates, allFinished } = advanceRoundTick(laneStates, 100)

      expect(updatedLaneStates[0].distanceCovered).toBe(100)
      expect(updatedLaneStates[0].progress).toBe(1)
      expect(updatedLaneStates[0].finishPosition).toBe(1)

      expect(updatedLaneStates[1].distanceCovered).toBe(70)
      expect(updatedLaneStates[1].progress).toBe(0.7)
      expect(updatedLaneStates[1].finishPosition).toBeNull()
      expect(allFinished).toBe(false)
    })

    it('marks allFinished when all lanes reach the round distance', () => {
      const laneStates = [
        {
          horse: { id: 'h1', condition: 20 },
          distanceCovered: 90,
          progress: 0.9,
          finishPosition: null
        },
        {
          horse: { id: 'h2', condition: 15 },
          distanceCovered: 90,
          progress: 0.9,
          finishPosition: null
        }
      ]

      const { updatedLaneStates, allFinished } = advanceRoundTick(laneStates, 100)

      expect(updatedLaneStates.every((lane) => lane.progress === 1)).toBe(true)
      expect(allFinished).toBe(true)
    })
  })

  describe('resetScheduleRoundResults', () => {
    it('clears completion flags and horse finish positions', () => {
      const rounds = [
        {
          round: 1,
          isCompleted: true,
          horses: [
            { id: 'h1', finishPosition: 1 },
            { id: 'h2', finishPosition: 2 }
          ]
        }
      ]

      const reset = resetScheduleRoundResults(rounds)

      expect(reset[0].isCompleted).toBe(false)
      expect(reset[0].horses[0].finishPosition).toBeNull()
      expect(reset[0].horses[1].finishPosition).toBeNull()
    })
  })
})
