import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AuthorCard from './AuthorCard.vue'
import type { AuthorShort } from './types'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/authors/:id', component: { template: '<div />' } },
    { path: '/', component: { template: '<div />' } },
  ],
})

const mockAuthor: AuthorShort = {
  id: 1,
  full_name: 'Тестовый Автор',
}

describe('AuthorCard', () => {
  const mountCard = (props: { author: AuthorShort; isAuthenticated?: boolean; isEditing?: boolean; editingName?: string } = {}) =>
    mount(AuthorCard, {
      props: {
        author: mockAuthor,
        isAuthenticated: false,
        isEditing: false,
        editingName: '',
        ...props,
      },
      global: {
        plugins: [router],
      },
    })

  it('renders author name', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('Тестовый Автор')
  })

  it('renders link to author details', () => {
    const wrapper = mountCard()
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
  })

  it('hides auth-gated buttons when not authenticated', () => {
    const wrapper = mountCard({ isAuthenticated: false })
    expect(wrapper.text()).not.toContain('Изменить')
    expect(wrapper.text()).not.toContain('Удалить')
  })

  it('shows auth-gated buttons when authenticated', () => {
    const wrapper = mountCard({ isAuthenticated: true })
    expect(wrapper.text()).toContain('Изменить')
    expect(wrapper.text()).toContain('Удалить')
  })

  it('emits edit event when edit button clicked', async () => {
    const wrapper = mountCard({ isAuthenticated: true })
    await wrapper.find('.btn-ghost').trigger('click')
    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')![0]).toEqual([1, 'Тестовый Автор'])
  })

  it('emits remove event when remove button clicked', async () => {
    const wrapper = mountCard({ isAuthenticated: true })
    await wrapper.find('.btn-danger').trigger('click')
    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted('remove')![0]).toEqual([1])
  })

  it('shows editing UI when isEditing is true', () => {
    const wrapper = mountCard({ isEditing: true, editingName: 'Новое имя' })
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('[title="Сохранить"]').exists()).toBe(true)
    expect(wrapper.find('[title="Отменить"]').exists()).toBe(true)
  })
})
