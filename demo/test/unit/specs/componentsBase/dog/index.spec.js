import { mount } from '@vue/test-utils'
import Dog from '@/componentsBase/dog'

describe('cb-dog', () => {
  const wrapper = mount(Dog, {
    propsData: {
      name: 'Tom'
    }
  })

  it('props: name', () => {
    wrapper.setProps({ name: 'Tom' })
    expect(wrapper.html()).toContain('Tom')
  })

  it('methods: add', () => {
    expect(wrapper.vm.add(1, 2)).toBe(3)
  })
})