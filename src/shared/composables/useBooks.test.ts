import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useBooks } from './useBooks'

vi.mock('@/shared/api/useBooksApi', () => ({
  useBooksApi: () => ({
    getBooks: vi.fn(),
    getBook: vi.fn(),
    createBook: vi.fn(),
    updateBook: vi.fn(),
    deleteBook: vi.fn(),
  }),
}))

describe('useBooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('mock mode', () => {
    it('getBooks loads books with default pagination', async () => {
      const { books, pagination, getBooks } = useBooks()
      await getBooks()
      expect(books.value.length).toBeGreaterThan(0)
      expect(pagination.value.total).toBeGreaterThan(0)
      expect(pagination.value.page).toBe(1)
    })

    it('getBooks filters by search term', async () => {
      const { books, getBooks } = useBooks()
      await getBooks({ search: 'Вечерний' })
      expect(books.value.length).toBe(1)
      expect(books.value[0]?.title).toContain('Вечерний')
    })

    it('getBooks filters by year', async () => {
      const { books, getBooks } = useBooks()
      await getBooks({ year: 1922 })
      expect(books.value.length).toBe(1)
      expect(books.value[0]?.year).toBe(1922)
    })

    it('getBooks filters by authorId', async () => {
      const { books, getBooks } = useBooks()
      await getBooks({ authorId: 1 })
      expect(books.value.length).toBeGreaterThan(0)
      books.value.forEach((b) => {
        expect(b?.authors?.some((a) => a.id === 1)).toBe(true)
      })
    })

    it('getBooks paginates results', async () => {
      const { books, pagination, getBooks } = useBooks()
      await getBooks({ page: 1, perPage: 2 })
      expect(books.value.length).toBeLessThanOrEqual(2)
      expect(pagination.value?.per_page).toBe(2)
    })

    it('getBook returns a book by id', async () => {
      const { getBook } = useBooks()
      const book = await getBook(1)
      expect(book).toBeDefined()
      expect(book?.id).toBe(1)
    })

    it('getBook returns undefined for non-existent id', async () => {
      const { getBook } = useBooks()
      const book = await getBook(9999)
      expect(book).toBeUndefined()
    })

    it('saveBook creates a new book', async () => {
      const instance = useBooks()
      const input = { title: 'Тестовая книга', year: 2024, description: 'Описание', isbn: '123', author_ids: [1] }
      const result = await instance.saveBook(input, undefined, undefined)
      expect(result).toBeDefined()
      expect(result!.title).toBe('Тестовая книга')

      await instance.getBooks()
      expect(instance.books.value.some((b) => b.title === 'Тестовая книга')).toBe(true)
    })

    it('saveBook updates an existing book', async () => {
      const { saveBook } = useBooks()
      const input = { title: 'Обновлённая', year: 1922, description: '', isbn: '', author_ids: [1] }
      const result = await saveBook(input, 1, undefined)
      expect(result).toBeDefined()
      expect(result!.title).toBe('Обновлённая')
    })

    it('deleteBook removes a book', async () => {
      const instance = useBooks()
      await instance.getBooks({ perPage: 100 })
      const initialCount = instance.books.value.length

      await instance.deleteBook(1)
      await instance.getBooks({ perPage: 100 })
      expect(instance.books.value.length).toBe(initialCount - 1)
    })

    it('clears error on successful getBooks', async () => {
      const instance = useBooks()
      await instance.getBooks()
      expect(instance.error.value).toBe('')
    })
  })
})
