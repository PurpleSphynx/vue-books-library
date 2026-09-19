import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import AuthorsPage from './AuthorsPage.vue'

const mockAuthors = ref([{ id: 1, full_name: 'Автор 1' }, { id: 2, full_name: 'Автор 2' }])

vi.mock('@/entities/author/model/use-author-list', () => ({
  useAuthorList: () => ({
    authors: mockAuthors,
    loading: ref(false),
    error: ref(''),
    fetchAuthors: vi.fn().mockResolvedValue(undefined),
  }),
}))

vi.mock('@/entities/author/model/use-author-mutations', () => ({
  useAuthorMutations: () => ({
    saving: ref(false),
    error: ref(''),
    saveAuthor: vi.fn().mockResolvedValue(undefined),
    removeAuthor: vi.fn().mockResolvedValue(undefined),
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
    mockAuthors.value = [{ id: 1, full_name: 'Автор 1' }, { id: 2, full_name: 'Автор 2' }]
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
    const searchInput = wrapper.find('input[placeholder="Найти автора"]')
    expect(searchInput.exists()).toBe(true)
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
