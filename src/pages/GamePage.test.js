import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import GamePage from './GamePage.vue'
import { useAppStore } from '../stores/appStore'

const pushSpy = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushSpy
  })
}))

describe('GamePage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    pushSpy.mockClear()
  })

  it('starts race when start button is clicked', async () => {
    const store = useAppStore()
    const startSpy = vi.spyOn(store, 'startRace')

    const wrapper = mount(GamePage, {
      global: {
        stubs: {
          RaceAnimation: true,
          RaceProgram: true
        }
      }
    })

    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')

    expect(startSpy).toHaveBeenCalledTimes(1)
  })

  it('calls pause and resume actions from toggle button', async () => {
    const store = useAppStore()
    const pauseSpy = vi.spyOn(store, 'pauseRace')
    const resumeSpy = vi.spyOn(store, 'resumeRace')
    store.isRunning = true
    store.isPaused = false
    store.isCountdownActive = false

    const wrapper = mount(GamePage, {
      global: {
        stubs: {
          RaceAnimation: true,
          RaceProgram: true
        }
      }
    })

    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')
    expect(pauseSpy).toHaveBeenCalledTimes(1)

    store.isPaused = true
    store.isRunning = false
    await nextTick()

    await buttons[1].trigger('click')
    expect(resumeSpy).toHaveBeenCalledTimes(1)
  })

  it('redirects to results when raceCompleted becomes true', async () => {
    const store = useAppStore()
    const wrapper = mount(GamePage, {
      global: {
        stubs: {
          RaceAnimation: true,
          RaceProgram: true
        }
      }
    })

    store.raceCompleted = true
    await nextTick()

    expect(pushSpy).toHaveBeenCalledWith('/results')
    wrapper.unmount()
  })
})
