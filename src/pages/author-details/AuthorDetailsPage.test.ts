import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import AuthorDetailsPage from './AuthorDetailsPage.vue'

const mockAuthor = {
  id: 1,
  full_name: 'Тестовый Автор',
  books: [
    { id: 1, title: 'Книга 1', year: 2024 },
    { id: 2, title: 'Книга 2', year: 2023 },
  ],
}

vi.mock('@/entities/author/model/use-author-item', () => ({
  useAuthorItem: () => ({
    author: ref(mockAuthor),
    loading: ref(false),
    error: ref(''),
    fetchAuthor: vi.fn().mockResolvedValue(undefined),
  }),
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/authors/:id', component: AuthorDetailsPage },
    { path: '/authors', component: { template: '<div />' } },
    { path: '/books/:id', component: { template: '<div />' } },
    { path: '/login', component: { template: '<div />' } },
  ],
})

describe('AuthorDetailsPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  const mountPage = () =>
    mount(AuthorDetailsPage, {
      global: {
        plugins: [router],
        stubs: { teleport: true },
      },
    })

  it('renders author name', async () => {
    await router.push('/authors/1')
    await router.isReady()
    const wrapper = mountPage()
    await vi.dynamicImportSettled()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).toContain('Тестовый Автор')
  })

  it('renders author books', async () => {
    await router.push('/authors/1')
    await router.isReady()
    const wrapper = mountPage()
    await vi.dynamicImportSettled()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).toContain('Книга 1')
    expect(wrapper.text()).toContain('Книга 2')
  })

  it('renders back link', async () => {
    await router.push('/authors/1')
    await router.isReady()
    const wrapper = mountPage()
    await vi.dynamicImportSettled()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).toContain('Все авторы')
  })

  it('renders subscribe button', async () => {
    await router.push('/authors/1')
    await router.isReady()
    const wrapper = mountPage()
    await vi.dynamicImportSettled()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).toContain('Подписаться')
  })

  it('renders books section title', async () => {
    await router.push('/authors/1')
    await router.isReady()
    const wrapper = mountPage()
    await vi.dynamicImportSettled()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).toContain('Книги автора')
  })
})
