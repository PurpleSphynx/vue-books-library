import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import CatalogPage from './CatalogPage.vue'

const mockBooks = ref([{ id: 1, title: 'Книга 1', year: 2024, description: 'Описание', isbn: '123', cover_url: '/cover.svg', authors: [{ id: 1, full_name: 'Автор' }] }])
const mockPagination = ref({ total: 1, page: 1, per_page: 12, total_pages: 1 })
const mockLoading = ref(false)
const mockError = ref('')
const mockAuthors = ref([{ id: 1, full_name: 'Автор' }])

vi.mock('@/entities/book/model/use-book-list', () => ({
  useBookList: () => ({
    books: mockBooks,
    pagination: mockPagination,
    loading: mockLoading,
    error: mockError,
    fetchBooks: vi.fn().mockResolvedValue(undefined),
  }),
}))

vi.mock('@/entities/author/model/use-author-list', () => ({
  useAuthorList: () => ({
    authors: mockAuthors,
    loading: ref(false),
    error: ref(''),
    fetchAuthors: vi.fn().mockResolvedValue(undefined),
  }),
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: CatalogPage },
    { path: '/books/:id', component: { template: '<div />' } },
    { path: '/login', component: { template: '<div />' } },
  ],
})

describe('CatalogPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    mockBooks.value = [{ id: 1, title: 'Книга 1', year: 2024, description: 'Описание', isbn: '123', cover_url: '/cover.svg', authors: [{ id: 1, full_name: 'Автор' }] }]
    mockPagination.value = { total: 1, page: 1, per_page: 12, total_pages: 1 }
    mockAuthors.value = [{ id: 1, full_name: 'Автор' }]
  })

  const mountPage = () =>
    mount(CatalogPage, {
      global: {
        plugins: [router],
        stubs: { teleport: true },
      },
    })

  it('renders hero section with title', async () => {
    await router.push('/')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Книжный каталог')
    expect(wrapper.text()).toContain('Истории, к которым хочется возвращаться.')
  })

  it('renders search inputs', async () => {
    await router.push('/')
    await router.isReady()
    const wrapper = mountPage()
    const searchInput = wrapper.find('input[placeholder="Поиск по названию"]')
    expect(searchInput.exists()).toBe(true)
  })

  it('renders book cards', async () => {
    await router.push('/')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Книга 1')
  })

  it('shows total results count', async () => {
    await router.push('/')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('результат')
  })

  it('has filter toggle button on mobile', async () => {
    await router.push('/')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Фильтры')
  })
})
