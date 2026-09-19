import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ReportsTable from './ReportsTable.vue'
import type { TopAuthor } from '@/shared/types'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/authors/:id', component: { template: '<div />' } },
    { path: '/', component: { template: '<div />' } },
  ],
})

const mockItems: TopAuthor[] = [
  { rank: 1, author_id: 1, full_name: 'Автор А', books_count: 10 },
  { rank: 2, author_id: 2, full_name: 'Автор Б', books_count: 5 },
]

describe('ReportsTable', () => {
  const mountTable = (items: TopAuthor[] = mockItems) =>
    mount(ReportsTable, {
      props: { items },
      global: {
        plugins: [router],
      },
    })

  it('renders author names', () => {
    const wrapper = mountTable()
    expect(wrapper.text()).toContain('Автор А')
    expect(wrapper.text()).toContain('Автор Б')
  })

  it('renders ranks', () => {
    const wrapper = mountTable()
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('2')
  })

  it('renders books count', () => {
    const wrapper = mountTable()
    expect(wrapper.text()).toContain('10')
    expect(wrapper.text()).toContain('5')
  })

  it('renders table headers', () => {
    const wrapper = mountTable()
    expect(wrapper.text()).toContain('Место')
    expect(wrapper.text()).toContain('Автор')
    expect(wrapper.text()).toContain('Книг')
  })

  it('renders author links', () => {
    const wrapper = mountTable()
    const links = wrapper.findAll('a')
    expect(links.length).toBe(2)
  })
})
