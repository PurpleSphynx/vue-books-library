import { ref } from 'vue'
import { getBook } from '../api/books-api'
import type { Book } from './types'

export function useBookItem() {
  const book = ref<Book>()
  const loading = ref(false)
  const error = ref('')

  async function fetchBook(id: number) {
    loading.value = true
    error.value = ''
    try {
      book.value = await getBook(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Книга не найдена'
    } finally {
      loading.value = false
    }
  }

  return { book, loading, error, fetchBook }
}
