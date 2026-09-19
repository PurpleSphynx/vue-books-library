import { ref } from 'vue'
import { getAuthor } from '../api/authors-api'
import type { Author } from './types'

export function useAuthorItem() {
  const author = ref<Author>()
  const loading = ref(false)
  const error = ref('')

  async function fetchAuthor(id: number) {
    loading.value = true
    error.value = ''
    try {
      author.value = await getAuthor(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Автор не найден'
    } finally {
      loading.value = false
    }
  }

  return { author, loading, error, fetchAuthor }
}
