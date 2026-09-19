import { ref } from 'vue'
import { createAuthor, updateAuthor, deleteAuthor } from '../api/authors-api'
import type { AuthorInput } from './types'

export function useAuthorMutations() {
  const saving = ref(false)
  const error = ref('')

  async function saveAuthor(input: AuthorInput, id?: number) {
    saving.value = true
    error.value = ''
    try {
      return id ? await updateAuthor(id, input) : await createAuthor(input)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка сохранения'
      throw e
    } finally {
      saving.value = false
    }
  }

  async function removeAuthor(id: number) {
    saving.value = true
    error.value = ''
    try {
      await deleteAuthor(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка удаления'
      throw e
    } finally {
      saving.value = false
    }
  }

  return { saving, error, saveAuthor, removeAuthor }
}
