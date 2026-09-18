import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Modal from './Modal.vue'

describe('Modal', () => {
  const mountComponent = (props = {}) =>
    mount(Modal, {
      props: { open: false, ...props },
      slots: { title: 'Заголовок', default: 'Содержимое модалки' },
      global: { stubs: { teleport: true } },
    })

  it('does not render when open is false', () => {
    const wrapper = mountComponent({ open: false })
    expect(wrapper.find('.modal-backdrop-custom').exists()).toBe(false)
  })

  it('renders when open is true', () => {
    const wrapper = mountComponent({ open: true })
    expect(wrapper.find('.modal-backdrop-custom').exists()).toBe(true)
  })

  it('renders title slot', () => {
    const wrapper = mountComponent({ open: true })
    expect(wrapper.text()).toContain('Заголовок')
  })

  it('renders default slot', () => {
    const wrapper = mountComponent({ open: true })
    expect(wrapper.text()).toContain('Содержимое модалки')
  })

  it('emits close when close button is clicked', async () => {
    const wrapper = mountComponent({ open: true })
    const closeButton = wrapper.find('button[aria-label="Закрыть"]')
    await closeButton.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close when "Понятно" button is clicked', async () => {
    const wrapper = mountComponent({ open: true })
    const buttons = wrapper.findAll('button')
    const okButton = buttons.find((b) => b.text().includes('Понятно'))
    await okButton?.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('renders default title when no slot provided', () => {
    const wrapper = mount(Modal, {
      props: { open: true },
      global: { stubs: { teleport: true } },
    })
    expect(wrapper.text()).toContain('Готово')
  })
})
