import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import AuthorsPage from './AuthorsPage.vue'

vi.mock('@/shared/composables/useAuthors', () => ({
  useAuthors: () => ({
    authors: { value: [{ id: 1, full_name: 'Автор 1' }, { id: 2, full_name: 'Автор 2' }] },
    loading: { value: false },
    error: { value: '' },
    getAuthors: vi.fn().mockResolvedValue(undefined),
    getAuthor: vi.fn(),
    saveAuthor: vi.fn().mockResolvedValue(undefined),
    deleteAuthor: vi.fn().mockResolvedValue(undefined),
  }),
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/authors', component: AuthorsPage },
    { path: '/authors/:id', component: { template: '<div />' } },
    { path: '/login', component: { template: '<div />' } },
  ],
})

describe('AuthorsPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  const mountPage = () =>
    mount(AuthorsPage, {
      global: {
        plugins: [router],
        stubs: { teleport: true },
      },
    })

  it('renders page title', async () => {
    await router.push('/authors')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Авторы')
  })

  it('renders author cards', async () => {
    await router.push('/authors')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Автор 1')
    expect(wrapper.text()).toContain('Автор 2')
  })

  it('renders search input', async () => {
    await router.push('/authors')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Найти автора')
  })

  it('hides add form when not authenticated', async () => {
    await router.push('/authors')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).not.toContain('Добавить автора')
  })

  it('shows add form when authenticated', async () => {
    localStorage.setItem('book-token', 'mock-token')
    localStorage.setItem('book-user', JSON.stringify({ id: 1, username: 'reader', role: 'user' }))
    await router.push('/authors')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Добавить автора')
  })
})
