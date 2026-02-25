import { mount } from '@vue/test-utils'
import CustomButton from './CustomButton.vue'

describe('CustomButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(CustomButton, {
      slots: { default: 'Click me' }
    })

    expect(wrapper.text()).toContain('Click me')
  })

  it('passes disabled and type attributes to native button', () => {
    const wrapper = mount(CustomButton, {
      props: {
        disabled: true,
        type: 'submit'
      }
    })

    const button = wrapper.get('button')
    expect(button.attributes('type')).toBe('submit')
    expect(button.attributes()).toHaveProperty('disabled')
  })
})
