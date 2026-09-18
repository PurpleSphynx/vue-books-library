import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ReportsTable from './ReportsTable.vue'
import type { TopAuthor } from '@/shared/types'

const mockItems: TopAuthor[] = [
  { rank: 1, author_id: 1, full_name: 'Автор А', books_count: 10 },
  { rank: 2, author_id: 2, full_name: 'Автор Б', books_count: 8 },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
})

describe('ReportsTable', () => {
  const mountComponent = (items: TopAuthor[] = mockItems) =>
    mount(ReportsTable, {
      props: { items },
      global: { plugins: [router] },
    })

  it('renders table headers', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Место')
    expect(wrapper.text()).toContain('Автор')
    expect(wrapper.text()).toContain('Книг')
  })

  it('renders correct number of rows', () => {
    const wrapper = mountComponent()
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
  })

  it('renders rank, author name, and book count', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('Автор А')
    expect(wrapper.text()).toContain('10')
  })

  it('links author name to author detail page', () => {
    const wrapper = mountComponent()
    const links = wrapper.findAll('.table-author-link')
    expect(links[0].attributes('href')).toBe('/authors/1')
    expect(links[1].attributes('href')).toBe('/authors/2')
  })

  it('renders empty table when no items', () => {
    const wrapper = mountComponent([])
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(0)
  })
})
