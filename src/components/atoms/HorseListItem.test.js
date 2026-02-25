import { mount } from '@vue/test-utils'
import HorseListItem from './HorseListItem.vue'

describe('HorseListItem', () => {
  it('renders horse name, condition and swatch color', () => {
    const horse = {
      id: 'h1',
      name: 'Horse 1',
      hex: '#6b705c',
      condition: 82
    }

    const wrapper = mount(HorseListItem, {
      props: { horse }
    })

    expect(wrapper.text()).toContain('Horse 1')
    expect(wrapper.text()).toContain('Condition: 82')
    expect(wrapper.get('.swatch').attributes('style')).toContain('background-color')
  })
})
