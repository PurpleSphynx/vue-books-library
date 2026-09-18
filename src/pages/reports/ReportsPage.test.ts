import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import ReportsPage from './ReportsPage.vue'

vi.mock('@/shared/composables/useReports', () => ({
  useReports: () => ({
    items: { value: [{ rank: 1, author_id: 1, full_name: 'Автор А', books_count: 10 }] },
    loading: { value: false },
    getTopAuthors: vi.fn().mockResolvedValue(undefined),
  }),
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/reports/top-authors', component: ReportsPage },
    { path: '/authors/:id', component: { template: '<div />' } },
    { path: '/login', component: { template: '<div />' } },
  ],
})

describe('ReportsPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  const mountPage = () =>
    mount(ReportsPage, {
      global: {
        plugins: [router],
        stubs: { teleport: true },
      },
    })

  it('renders page title', async () => {
    await router.push('/reports/top-authors')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Топ авторов')
  })

  it('renders description with year', async () => {
    await router.push('/reports/top-authors')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Авторы, выпустившие больше всего книг в')
    expect(wrapper.text()).toContain('году.')
  })

  it('renders year input', async () => {
    await router.push('/reports/top-authors')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.find('input[type="number"]').exists()).toBe(true)
  })

  it('renders update button', async () => {
    await router.push('/reports/top-authors')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Обновить')
  })

  it('renders report table', async () => {
    await router.push('/reports/top-authors')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Автор А')
    expect(wrapper.text()).toContain('10')
  })
})
