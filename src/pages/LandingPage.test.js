import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LandingPage from './LandingPage.vue'

const pushSpy = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushSpy
  })
}))

describe('LandingPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    pushSpy.mockClear()
  })

  it('renders heading and action button', () => {
    const wrapper = mount(LandingPage)

    expect(wrapper.text()).toContain('Horse Race Simulator')
    expect(wrapper.text()).toContain('Generate Program')
  })

  it('routes to game page when button is clicked', async () => {
    const wrapper = mount(LandingPage)

    await wrapper.get('button').trigger('click')

    expect(pushSpy).toHaveBeenCalledWith('/game')
  })
})
