import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import BookCard from './BookCard.vue'
import type { Book } from '@/shared/types'

const mockBook: Book = {
  id: 1,
  title: 'Тестовая книга',
  year: 2024,
  description: 'Описание книги для теста',
  isbn: '978-5-17-123456-7',
  cover_url: '/mock-covers/test.svg',
  authors: [{ id: 1, full_name: 'Автор Тест' }],
}

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
})

describe('BookCard', () => {
  const mountComponent = () =>
    mount(BookCard, {
      props: { book: mockBook },
      global: { plugins: [router] },
    })

  it('renders book title', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Тестовая книга')
  })

  it('renders book year', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('2024')
  })

  it('renders author count', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('1 авт.')
  })

  it('renders book description', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Описание книги для теста')
  })

  it('renders cover image with correct src', () => {
    const wrapper = mountComponent()
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('/mock-covers/test.svg')
    expect(img.attributes('alt')).toBe('Тестовая книга')
  })

  it('links to book detail page', () => {
    const wrapper = mountComponent()
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/books/1')
  })

  it('shows correct author count for multiple authors', () => {
    const bookWithMultipleAuthors = {
      ...mockBook,
      authors: [
        { id: 1, full_name: 'Автор 1' },
        { id: 2, full_name: 'Автор 2' },
      ],
    }
    const wrapper = mount(BookCard, {
      props: { book: bookWithMultipleAuthors },
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain('2 авт.')
  })
})
