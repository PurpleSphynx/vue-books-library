import { ref } from 'vue'
import { createBook, updateBook, deleteBook } from '../api/books-api'
import type { BookInput } from './types'

export function useBookMutations() {
  const saving = ref(false)
  const error = ref('')

  async function saveBook(input: BookInput, id?: number, cover?: File) {
    saving.value = true
    error.value = ''
    try {
      return id ? await updateBook(id, input, cover) : await createBook(input, cover!)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка сохранения'
      throw e
    } finally {
      saving.value = false
    }
  }

  async function removeBook(id: number) {
    saving.value = true
    error.value = ''
    try {
      await deleteBook(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка удаления'
      throw e
    } finally {
      saving.value = false
    }
  }

  return { saving, error, saveBook, removeBook }
}
