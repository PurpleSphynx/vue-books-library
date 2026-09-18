import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AuthorCard from './AuthorCard.vue'
import type { AuthorShort } from '@/shared/types'

const mockAuthor: AuthorShort = { id: 1, full_name: 'Тестовый Автор' }

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
})

describe('AuthorCard', () => {
  const mountComponent = (props = {}) =>
    mount(AuthorCard, {
      props: {
        author: mockAuthor,
        isAuthenticated: false,
        isEditing: false,
        editingName: '',
        ...props,
      },
      global: { plugins: [router] },
    })

  it('renders author name', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Тестовый Автор')
  })

  it('links to author detail page', () => {
    const wrapper = mountComponent()
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/authors/1')
  })

  it('hides edit/delete buttons when not authenticated', () => {
    const wrapper = mountComponent({ isAuthenticated: false })
    expect(wrapper.text()).not.toContain('Изменить')
    expect(wrapper.text()).not.toContain('Удалить')
  })

  it('shows edit/delete buttons when authenticated', () => {
    const wrapper = mountComponent({ isAuthenticated: true })
    expect(wrapper.text()).toContain('Изменить')
    expect(wrapper.text()).toContain('Удалить')
  })

  it('emits edit event with correct payload', async () => {
    const wrapper = mountComponent({ isAuthenticated: true })
    const editButton = wrapper.findAll('button').find((b) => b.text().includes('Изменить'))
    await editButton?.trigger('click')
    expect(wrapper.emitted('edit')).toEqual([[1, 'Тестовый Автор']])
  })

  it('emits remove event with correct payload', async () => {
    const wrapper = mountComponent({ isAuthenticated: true })
    const removeButton = wrapper.findAll('button').find((b) => b.text().includes('Удалить'))
    await removeButton?.trigger('click')
    expect(wrapper.emitted('remove')).toEqual([[1]])
  })

  it('shows editing form when isEditing is true', () => {
    const wrapper = mountComponent({ isEditing: true, editingName: 'Новое имя' })
    expect(wrapper.find('input').element.value).toBe('Новое имя')
  })

  it('emits save event when save button is clicked', async () => {
    const wrapper = mountComponent({ isEditing: true, editingName: 'Новое имя' })
    const saveButton = wrapper.find('button[title="Сохранить"]')
    await saveButton.trigger('click')
    expect(wrapper.emitted('save')).toBeTruthy()
  })

  it('emits cancel event when cancel button is clicked', async () => {
    const wrapper = mountComponent({ isEditing: true, editingName: 'Новое имя' })
    const cancelButton = wrapper.find('button[title="Отменить"]')
    await cancelButton.trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('emits update:editingName when input changes', async () => {
    const wrapper = mountComponent({ isEditing: true, editingName: '' })
    const input = wrapper.find('input')
    await input.setValue('Обновлённое имя')
    expect(wrapper.emitted('update:editingName')).toBeTruthy()
  })
})
