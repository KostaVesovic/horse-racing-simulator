import { mount } from '@vue/test-utils'
import HorseAnimation from './HorseAnimation.vue'

describe('HorseAnimation', () => {
  it('applies size variant and base color variables', () => {
    const wrapper = mount(HorseAnimation, {
      props: {
        size: 'small',
        colorName: 'olive'
      }
    })

    const style = wrapper.get('.horse-animation').attributes('style')
    expect(style).toContain('--horse-size: 20px')
    expect(style).toContain('--color-horse:')
  })

  it('uses large size variant when requested', () => {
    const wrapper = mount(HorseAnimation, {
      props: {
        size: 'large',
        colorName: 'teal'
      }
    })

    const style = wrapper.get('.horse-animation').attributes('style')
    expect(style).toContain('--horse-size: 120px')
  })

  it('falls back to charcoal for unknown color names', () => {
    const wrapper = mount(HorseAnimation, {
      props: {
        colorName: 'not-a-real-color'
      }
    })

    const style = wrapper.get('.horse-animation').attributes('style')
    expect(style).toContain('--color-horse: #323232')
  })

  it('sets all derived horse color css variables', () => {
    const wrapper = mount(HorseAnimation, {
      props: {
        colorName: 'olive'
      }
    })

    const style = wrapper.get('.horse-animation').attributes('style')
    expect(style).toContain('--color-horse:')
    expect(style).toContain('--color-horse-back:')
    expect(style).toContain('--color-hair:')
    expect(style).toContain('--color-hoof:')
  })

  it('updates style variables when colorName changes', async () => {
    const wrapper = mount(HorseAnimation, {
      props: {
        colorName: 'olive'
      }
    })

    const before = wrapper.get('.horse-animation').attributes('style')
    await wrapper.setProps({ colorName: 'teal' })
    const after = wrapper.get('.horse-animation').attributes('style')

    expect(after).not.toBe(before)
  })

  it('renders horse markup without click plumbing', () => {
    const wrapper = mount(HorseAnimation)

    expect(wrapper.find('label').exists()).toBe(true)
    expect(wrapper.find('.horse').exists()).toBe(true)
  })
})
