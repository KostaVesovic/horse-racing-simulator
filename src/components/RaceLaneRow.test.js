import { shallowMount } from '@vue/test-utils'
import RaceLaneRow from './RaceLaneRow.vue'

const baseLane = {
  horse: { name: 'Horse 1', color: 'olive' },
  progress: 0.5,
  finishPosition: null
}

describe('RaceLaneRow', () => {
  it('renders horse name and runner style', () => {
    const wrapper = shallowMount(RaceLaneRow, {
      props: {
        lane: baseLane,
        isCountdownActive: false
      }
    })

    expect(wrapper.text()).toContain('Horse 1')
    const style = wrapper.get('.horse-runner').attributes('style')
    expect(style).toContain('left: 50%')
    expect(style).toContain('transform: translateX(-50%)')
  })

  it('shows finish badge when finish position exists', () => {
    const wrapper = shallowMount(RaceLaneRow, {
      props: {
        lane: { ...baseLane, finishPosition: 2 },
        isCountdownActive: false
      }
    })

    expect(wrapper.get('.finish-order').text()).toBe('2')
    expect(wrapper.find('horse-animation-stub').exists()).toBe(false)
  })

  it('disables transition during countdown', () => {
    const wrapper = shallowMount(RaceLaneRow, {
      props: {
        lane: baseLane,
        isCountdownActive: true
      }
    })

    expect(wrapper.get('.horse-runner').attributes('style')).toContain('transition: none')
  })
})
