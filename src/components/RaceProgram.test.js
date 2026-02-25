import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RaceProgram from './RaceProgram.vue'
import { useAppStore } from '../stores/appStore'

describe('RaceProgram', () => {
  it('renders rounds and marks completed cards', () => {
    setActivePinia(createPinia())
    const store = useAppStore()
    store.raceSchedule = {
      rounds: [
        {
          round: 1,
          distance: 1200,
          isCompleted: true,
          horses: [{ id: 'h1', name: 'Horse 1', hex: '#6b705c', condition: 80, finishPosition: 1 }]
        },
        {
          round: 2,
          distance: 1400,
          isCompleted: false,
          horses: [{ id: 'h2', name: 'Horse 2', hex: '#3a6f73', condition: 70, finishPosition: null }]
        }
      ],
      totalRounds: 2,
      generatedAt: Date.now()
    }

    const wrapper = mount(RaceProgram)

    expect(wrapper.findAll('.round-card')).toHaveLength(2)
    expect(wrapper.findAll('.round-card.is-completed')).toHaveLength(1)
    expect(wrapper.text()).toContain('Round 1')
    expect(wrapper.text()).toContain('Place: 1')
  })

  it('renders optional actions slot', () => {
    setActivePinia(createPinia())
    const store = useAppStore()
    store.raceSchedule = { rounds: [], totalRounds: 0, generatedAt: Date.now() }

    const wrapper = mount(RaceProgram, {
      slots: {
        actions: '<button class="test-action">Action</button>'
      }
    })

    expect(wrapper.find('.test-action').exists()).toBe(true)
  })
})
