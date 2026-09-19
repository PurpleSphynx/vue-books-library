import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import BookEditPage from './BookEditPage.vue'

const mockAuthors = ref([{ id: 1, full_name: 'Автор 1' }, { id: 2, full_name: 'Автор 2' }])

const mockExistingBook = { id: 1, title: 'Существующая книга', year: 2024, description: 'Описание', isbn: '123', cover_url: '/cover.svg', authors: [{ id: 1, full_name: 'Автор' }] }

vi.mock('@/entities/book/model/use-book-item', () => ({
  useBookItem: () => ({
    book: ref(mockExistingBook),
    loading: ref(false),
    error: ref(''),
    fetchBook: vi.fn().mockResolvedValue(undefined),
  }),
}))

vi.mock('@/entities/book/model/use-book-mutations', () => ({
  useBookMutations: () => ({
    saving: ref(false),
    error: ref(''),
    saveBook: vi.fn().mockResolvedValue({ id: 1 }),
    removeBook: vi.fn(),
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
    { path: '/books/new', component: BookEditPage },
    { path: '/books/:id/edit', component: BookEditPage },
    { path: '/', component: { template: '<div />' } },
    { path: '/login', component: { template: '<div />' } },
  ],
})

describe('BookEditPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.setItem('book-token', 'mock-token')
    localStorage.setItem('book-token-expires-at', String(Date.now() + 86400000))
  })

  const mountPage = () =>
    mount(BookEditPage, {
      global: {
        plugins: [router],
        stubs: { teleport: true },
      },
    })

  it('renders form title for new book', async () => {
    await router.push('/books/new')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Новая книга')
  })

  it('renders form title for editing', async () => {
    await router.push('/books/1/edit')
    await router.isReady()
    const wrapper = mountPage()
    await vi.dynamicImportSettled()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.text()).toContain('Редактировать книгу')
  })

  it('renders form fields', async () => {
    await router.push('/books/new')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Название')
    expect(wrapper.text()).toContain('Год')
    expect(wrapper.text()).toContain('Авторы')
    expect(wrapper.text()).toContain('ISBN')
    expect(wrapper.text()).toContain('Описание')
    expect(wrapper.text()).toContain('Обложка')
  })

  it('renders submit button', async () => {
    await router.push('/books/new')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Сохранить книгу')
  })

  it('renders back link', async () => {
    await router.push('/books/new')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Назад')
  })
})
