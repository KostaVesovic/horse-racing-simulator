import { mount, shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RaceAnimation from './RaceAnimation.vue'
import { useAppStore } from '../stores/appStore'

describe('RaceAnimation', () => {
  it('renders round header and lane rows from store', () => {
    setActivePinia(createPinia())
    const store = useAppStore()
    store.raceSchedule = {
      rounds: [{ round: 2, distance: 1600, horses: [] }],
      totalRounds: 1,
      generatedAt: Date.now()
    }
    store.currentRoundIndex = 0
    store.currentRoundLaneStates = [
      {
        horse: { id: 'h1', name: 'Horse 1', color: 'olive' },
        progress: 0.2,
        finishPosition: null
      },
      {
        horse: { id: 'h2', name: 'Horse 2', color: 'teal' },
        progress: 0.5,
        finishPosition: null
      }
    ]
    store.isCountdownActive = false
    store.countdownValue = 3
    store.isRunning = true

    const wrapper = shallowMount(RaceAnimation)

    expect(wrapper.text()).toContain('Round 2 - 1600m')
    expect(wrapper.findAll('race-lane-row-stub')).toHaveLength(2)
    expect(wrapper.text()).toContain('Status: Running')
  })

  it('shows countdown overlay when active', () => {
    setActivePinia(createPinia())
    const store = useAppStore()
    store.raceSchedule = {
      rounds: [{ round: 1, distance: 1200, horses: [] }],
      totalRounds: 1,
      generatedAt: Date.now()
    }
    store.currentRoundLaneStates = []
    store.isCountdownActive = true
    store.countdownValue = 2

    const wrapper = mount(RaceAnimation, {
      global: {
        stubs: {
          RaceLaneRow: true
        }
      }
    })

    expect(wrapper.find('.round-overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('Next round starting in:')
    expect(wrapper.text()).toContain('2')
  })

  it('stops race engine on unmount', () => {
    setActivePinia(createPinia())
    const store = useAppStore()
    store.raceSchedule = {
      rounds: [{ round: 1, distance: 1200, horses: [] }],
      totalRounds: 1,
      generatedAt: Date.now()
    }

    const stopSpy = vi.spyOn(store, 'stopRaceEngine')
    const wrapper = shallowMount(RaceAnimation)
    wrapper.unmount()

    expect(stopSpy).toHaveBeenCalledTimes(1)
  })
})
