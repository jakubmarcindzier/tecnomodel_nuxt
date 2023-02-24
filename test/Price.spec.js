import { mount } from '@vue/test-utils'
import Price from '@/components/Price'

describe('Price', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Price)
    expect(wrapper.vm).toBeTruthy()
  })
})
