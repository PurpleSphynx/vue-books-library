import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import BookCard from './BookCard.vue'
import type { Book } from './types'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/books/:id', component: { template: '<div />' } },
    { path: '/', component: { template: '<div />' } },
  ],
})

const mockBook: Book = {
  id: 1,
  title: 'Тестовая книга',
  year: 2024,
  description: 'Описание тестовой книги',
  isbn: '978-5-17-123456-7',
  cover_url: '/mock-covers/test.svg',
  authors: [{ id: 1, full_name: 'Тестовый Автор' }],
}

describe('BookCard', () => {
  const mountCard = (book: Book = mockBook) =>
    mount(BookCard, {
      props: { book },
      global: {
        plugins: [router],
      },
    })

  it('renders book title', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('Тестовая книга')
  })

  it('renders book year', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('2024')
  })

  it('renders author count', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('1 авт.')
  })

  it('renders book description', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('Описание тестовой книги')
  })

  it('renders cover image', () => {
    const wrapper = mountCard()
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/mock-covers/test.svg')
    expect(img.attributes('alt')).toBe('Тестовая книга')
  })

  it('renders link to book details', () => {
    const wrapper = mountCard()
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
  })
})
