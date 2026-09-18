import { ref } from 'vue'
import { useBooksApi, type BookQuery } from '@/shared/api/useBooksApi'
import { mockBooks } from '@/shared/mock/data'
import type { Book, BookInput } from '@/shared/types'

export function useBooks() {
  const books = ref<Book[]>([])
  const pagination = ref({ total: 0, page: 1, per_page: 12, total_pages: 1 })
  const loading = ref(false)
  const error = ref('')
  const api = useBooksApi()

  function getLocalBooks(): Book[] {
    return structuredClone(mockBooks)
  }

  async function getBooks(filters: BookQuery = {}) {
    loading.value = true
    error.value = ''
    try {
      if (import.meta.env.VITE_USE_MOCK !== 'false') {
        let result = getLocalBooks()
        if (filters.search)
          result = result.filter((b) =>
            `${b.title} ${b.description}`.toLowerCase().includes(filters.search!.toLowerCase()),
          )
        if (filters.year) result = result.filter((b) => b.year === filters.year)
        if (filters.authorId)
          result = result.filter((b) => b.authors.some((a) => a.id === filters.authorId))
        const page = filters.page || 1
        const per = filters.perPage || 12
        books.value = result.slice((page - 1) * per, page * per)
        pagination.value = {
          total: result.length,
          page,
          per_page: per,
          total_pages: Math.max(1, Math.ceil(result.length / per)),
        }
      } else {
        const r = await api.getBooks(filters)
        books.value = r.items
        pagination.value = r.pagination
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка загрузки'
    } finally {
      loading.value = false
    }
  }

  async function getBook(id: number) {
    if (import.meta.env.VITE_USE_MOCK !== 'false') {
      return getLocalBooks().find((b) => b.id === id)
    }
    return api.getBook(id)
  }

  async function saveBook(input: BookInput, id?: number, cover?: File) {
    if (import.meta.env.VITE_USE_MOCK !== 'false') {
      const localBooks = getLocalBooks()
      if (id) {
        const item = localBooks.find((b) => b.id === id)
        if (item) {
          Object.assign(item, {
            ...input,
            cover_url: cover ? URL.createObjectURL(cover) : item.cover_url,
            authors: input.author_ids.map((authorId) => ({
              id: authorId,
              full_name: `Автор ${authorId}`,
            })),
          })
        }
        return item
      }
      const item: Book = {
        id: localBooks.length > 0 ? Math.max(...localBooks.map((b) => b.id)) + 1 : 1,
        ...input,
        cover_url: cover ? URL.createObjectURL(cover) : '',
        authors: input.author_ids.map((authorId) => ({
          id: authorId,
          full_name: `Автор ${authorId}`,
        })),
      }
      mockBooks.push(...localBooks.filter((lb) => !mockBooks.some((mb) => mb.id === lb.id)))
      mockBooks.push(item)
      return item
    }
    return id ? api.updateBook(id, input, cover) : api.createBook(input, cover!)
  }

  async function deleteBook(id: number) {
    if (import.meta.env.VITE_USE_MOCK !== 'false') {
      const i = mockBooks.findIndex((b) => b.id === id)
      if (i >= 0) mockBooks.splice(i, 1)
      return
    }
    return api.deleteBook(id)
  }

  return { books, pagination, loading, error, getBooks, getBook, saveBook, deleteBook }
}
