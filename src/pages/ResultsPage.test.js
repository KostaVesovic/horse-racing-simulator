import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ResultsPage from './ResultsPage.vue'
import { useAppStore } from '../stores/appStore'

const pushSpy = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushSpy
  })
}))

describe('ResultsPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    pushSpy.mockClear()
  })

  it('renders race program and back action', () => {
    const wrapper = mount(ResultsPage)

    expect(wrapper.text()).toContain('Race Program')
    expect(wrapper.text()).toContain('Back to Start')
  })

  it('resets results and routes to landing on back click', async () => {
    const store = useAppStore()
    const resetSpy = vi.spyOn(store, 'resetResultsAndGenerateRounds')

    const wrapper = mount(ResultsPage)
    await wrapper.get('button').trigger('click')

    expect(resetSpy).toHaveBeenCalledTimes(1)
    expect(pushSpy).toHaveBeenCalledWith('/')
  })
})
