import {
  createRaceSchedule,
  generateHorseListFromColors,
  generateRandomCondition,
  pickRandomEntries,
  shuffleArray
} from './raceData'

describe('raceData helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('generateRandomCondition', () => {
    it('generates condition values in expected range', () => {
      for (let i = 0; i < 100; i += 1) {
        const condition = generateRandomCondition()
        expect(condition).toBeGreaterThanOrEqual(50)
        expect(condition).toBeLessThanOrEqual(100)
      }
    })
  })

  describe('shuffleArray', () => {
    it('shuffles without mutating original array', () => {
      const original = [1, 2, 3, 4, 5]
      const copyBefore = [...original]

      const shuffled = shuffleArray(original)

      expect(original).toEqual(copyBefore)
      expect(shuffled).toHaveLength(original.length)
      expect(shuffled).not.toBe(original)
      expect([...shuffled].sort((a, b) => a - b)).toEqual(copyBefore)
    })
  })

  describe('generateHorseListFromColors', () => {
    it('builds horse list from color set', () => {
      const horseColors = [
        { name: 'olive', hex: '#6b705c' },
        { name: 'teal', hex: '#3a6f73' },
        { name: 'silver', hex: '#bfc0c0' }
      ]

      vi.spyOn(Date, 'now').mockReturnValue(123456)

      const horses = generateHorseListFromColors(horseColors)

      expect(horses).toHaveLength(3)
      expect(horses[0]).toMatchObject({
        id: '123456-0',
        name: 'Horse 1'
      })
      expect(horses.every((horse) => horse.condition >= 50 && horse.condition <= 100)).toBe(
        true
      )
      expect(horses.map((horse) => horse.color).sort()).toEqual(['olive', 'silver', 'teal'])
    })
  })

  describe('pickRandomEntries', () => {
    it('returns up to requested random entries', () => {
      const source = ['a', 'b', 'c', 'd']

      const picked = pickRandomEntries(source, 3)
      const pickedOverflow = pickRandomEntries(source, 10)

      expect(picked).toHaveLength(3)
      expect(picked.every((item) => source.includes(item))).toBe(true)
      expect(new Set(picked).size).toBe(3)

      expect(pickedOverflow).toHaveLength(4)
      expect(new Set(pickedOverflow).size).toBe(4)
    })
  })

  describe('createRaceSchedule', () => {
    it('creates a schedule with configured rounds', () => {
      const horses = [
        { id: 'h1', name: 'Horse 1', color: 'olive', hex: '#6b705c', condition: 80 },
        { id: 'h2', name: 'Horse 2', color: 'teal', hex: '#3a6f73', condition: 75 },
        { id: 'h3', name: 'Horse 3', color: 'silver', hex: '#bfc0c0', condition: 68 },
        { id: 'h4', name: 'Horse 4', color: 'ash', hex: '#8d99ae', condition: 91 },
        { id: 'h5', name: 'Horse 5', color: 'amber', hex: '#b56a2d', condition: 72 },
        { id: 'h6', name: 'Horse 6', color: 'bay', hex: '#6e3b24', condition: 84 },
        { id: 'h7', name: 'Horse 7', color: 'charcoal', hex: '#323232', condition: 77 },
        { id: 'h8', name: 'Horse 8', color: 'pearl', hex: '#e5e5e5', condition: 66 },
        { id: 'h9', name: 'Horse 9', color: 'copper', hex: '#b5653a', condition: 88 },
        { id: 'h10', name: 'Horse 10', color: 'roan', hex: '#7b6a58', condition: 79 }
      ]

      const schedule = createRaceSchedule({
        distances: [1200, 1400],
        horsesPerRound: 2,
        horses
      })

      expect(schedule.totalRounds).toBe(2)
      expect(schedule.rounds).toHaveLength(2)
      expect(schedule.rounds[0].horses).toHaveLength(2)
      expect(schedule.rounds[0].isCompleted).toBe(false)
      expect(schedule.rounds[0].round).toBe(1)
      expect(schedule.rounds[1].round).toBe(2)
      expect(schedule.rounds[0].horses[0]).toHaveProperty('finishPosition', null)
      expect(typeof schedule.generatedAt).toBe('number')
    })
  })
})
