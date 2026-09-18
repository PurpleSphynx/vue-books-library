import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  const mountComponent = (props = {}) =>
    mount(BaseButton, {
      props: { ...props },
      slots: { default: 'Нажми меня' },
    })

  it('renders slot content', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Нажми меня')
  })

  it('has type="button" by default', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('button').attributes('type')).toBe('button')
  })

  it('accepts type="submit"', () => {
    const wrapper = mountComponent({ type: 'submit' })
    expect(wrapper.find('button').attributes('type')).toBe('submit')
  })

  it('applies primary variant class by default', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('button').classes()).toContain('btn-primary')
  })

  it('applies outline variant class', () => {
    const wrapper = mountComponent({ variant: 'outline' })
    expect(wrapper.find('button').classes()).toContain('btn-outline')
  })

  it('applies danger variant class', () => {
    const wrapper = mountComponent({ variant: 'danger' })
    expect(wrapper.find('button').classes()).toContain('btn-danger')
  })

  it('applies ghost variant class', () => {
    const wrapper = mountComponent({ variant: 'ghost' })
    expect(wrapper.find('button').classes()).toContain('btn-ghost')
  })

  it('applies action variant class', () => {
    const wrapper = mountComponent({ variant: 'action' })
    expect(wrapper.find('button').classes()).toContain('btn-action')
  })

  it('applies w-100 when block is true', () => {
    const wrapper = mountComponent({ block: true })
    expect(wrapper.find('button').classes()).toContain('w-100')
  })

  it('disables button when disabled prop is true', () => {
    const wrapper = mountComponent({ disabled: true })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('disables button when loading prop is true', () => {
    const wrapper = mountComponent({ loading: true })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('shows spinner when loading', () => {
    const wrapper = mountComponent({ loading: true })
    expect(wrapper.find('.spinner-border').exists()).toBe(true)
  })

  it('hides spinner when not loading', () => {
    const wrapper = mountComponent({ loading: false })
    expect(wrapper.find('.spinner-border').exists()).toBe(false)
  })
})
