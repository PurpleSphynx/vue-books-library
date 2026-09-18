import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import BookDetailsPage from './BookDetailsPage.vue'

const mockBook = {
  id: 1,
  title: 'Тестовая книга',
  year: 2024,
  description: 'Описание тестовой книги',
  isbn: '978-5-17-123456-7',
  cover_url: '/mock-covers/test.svg',
  authors: [{ id: 1, full_name: 'Тестовый Автор' }],
}

vi.mock('@/shared/composables/useBooks', () => ({
  useBooks: () => ({
    getBook: vi.fn().mockResolvedValue(mockBook),
  }),
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/books/:id', component: BookDetailsPage },
    { path: '/', component: { template: '<div />' } },
    { path: '/authors/:id', component: { template: '<div />' } },
    { path: '/books/:id/edit', component: { template: '<div />' } },
    { path: '/login', component: { template: '<div />' } },
  ],
})

describe('BookDetailsPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  const mountPage = () =>
    mount(BookDetailsPage, {
      global: {
        plugins: [router],
        stubs: { teleport: true },
      },
    })

  it('renders book title', async () => {
    await router.push('/books/1')
    await router.isReady()
    const wrapper = mountPage()
    await vi.dynamicImportSettled()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).toContain('Тестовая книга')
  })

  it('renders book year', async () => {
    await router.push('/books/1')
    await router.isReady()
    const wrapper = mountPage()
    await vi.dynamicImportSettled()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).toContain('2024')
  })

  it('renders book description', async () => {
    await router.push('/books/1')
    await router.isReady()
    const wrapper = mountPage()
    await vi.dynamicImportSettled()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).toContain('Описание тестовой книги')
  })

  it('renders ISBN', async () => {
    await router.push('/books/1')
    await router.isReady()
    const wrapper = mountPage()
    await vi.dynamicImportSettled()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).toContain('978-5-17-123456-7')
  })

  it('renders author name', async () => {
    await router.push('/books/1')
    await router.isReady()
    const wrapper = mountPage()
    await vi.dynamicImportSettled()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).toContain('Тестовый Автор')
  })

  it('renders back link', async () => {
    await router.push('/books/1')
    await router.isReady()
    const wrapper = mountPage()
    await vi.dynamicImportSettled()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).toContain('Назад к каталогу')
  })

  it('renders subscribe button', async () => {
    await router.push('/books/1')
    await router.isReady()
    const wrapper = mountPage()
    await vi.dynamicImportSettled()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).toContain('Подписаться на автора')
  })
})
