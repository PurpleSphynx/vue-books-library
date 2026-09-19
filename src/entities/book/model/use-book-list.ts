import { ref } from 'vue'
import { getBooks, type BookQuery } from '../api/books-api'
import type { Book } from './types'

export function useBookList() {
  const books = ref<Book[]>([])
  const pagination = ref({ total: 0, page: 1, per_page: 12, total_pages: 1 })
  const loading = ref(false)
  const error = ref('')

  async function fetchBooks(filters: BookQuery = {}) {
    loading.value = true
    error.value = ''
    try {
      const r = await getBooks(filters)
      books.value = r.items
      pagination.value = r.pagination
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка загрузки'
    } finally {
      loading.value = false
    }
  }

  return { books, pagination, loading, error, fetchBooks }
}
