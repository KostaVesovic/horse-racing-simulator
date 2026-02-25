import { shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HorseList from './HorseList.vue'
import { useAppStore } from '../stores/appStore'

describe('HorseList', () => {
  it('renders one item per horse from store', () => {
    setActivePinia(createPinia())
    const store = useAppStore()
    store.horses = [
      { id: 'h1', name: 'Horse 1', hex: '#6b705c', condition: 70 },
      { id: 'h2', name: 'Horse 2', hex: '#3a6f73', condition: 90 }
    ]

    const wrapper = shallowMount(HorseList)

    expect(wrapper.findAll('horse-list-item-stub')).toHaveLength(2)
  })
})
