import { ref } from 'vue'
import { getAuthors } from '../api/authors-api'
import type { AuthorShort } from './types'

export function useAuthorList() {
  const authors = ref<AuthorShort[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchAuthors(search = '') {
    loading.value = true
    error.value = ''
    try {
      authors.value = (await getAuthors(search)).items
    } catch {
      error.value = 'Не удалось загрузить авторов'
    } finally {
      loading.value = false
    }
  }

  return { authors, loading, error, fetchAuthors }
}
