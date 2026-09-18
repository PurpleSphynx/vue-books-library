import { ref } from 'vue'
import { useAuthorsApi } from '@/shared/api/useAuthorsApi'
import { mockAuthors } from '@/shared/mock/data'
import type { Author, AuthorInput, AuthorShort } from '@/shared/types'

export function useAuthors() {
  const authors = ref<AuthorShort[]>([])
  const loading = ref(false)
  const error = ref('')
  const api = useAuthorsApi()
  async function getAuthors(search = '') {
    loading.value = true
    try {
      authors.value =
        import.meta.env.VITE_USE_MOCK !== 'false'
          ? mockAuthors.filter((a) => a.full_name.toLowerCase().includes(search.toLowerCase()))
          : (await api.getAuthors(search)).items
    } catch {
      error.value = 'Не удалось загрузить авторов'
    } finally {
      loading.value = false
    }
  }
  async function getAuthor(id: number) {
    return import.meta.env.VITE_USE_MOCK !== 'false'
      ? mockAuthors.find((a) => a.id === id)
      : api.getAuthor(id)
  }
  async function saveAuthor(input: AuthorInput, id?: number) {
    if (import.meta.env.VITE_USE_MOCK !== 'false') {
      if (id) {
        const item = mockAuthors.find((a) => a.id === id)
        if (item) item.full_name = input.full_name
        return item
      }
      const item: Author = {
        id: Math.max(...mockAuthors.map((a) => a.id)) + 1,
        full_name: input.full_name,
        books: [],
      }
      mockAuthors.push(item)
      return item
    }
    return id ? api.updateAuthor(id, input) : api.createAuthor(input)
  }
  async function deleteAuthor(id: number) {
    if (import.meta.env.VITE_USE_MOCK !== 'false') {
      const index = mockAuthors.findIndex((a) => a.id === id)
      if (index >= 0) mockAuthors.splice(index, 1)
      return
    }
    return api.deleteAuthor(id)
  }

  return { authors, loading, error, getAuthors, getAuthor, saveAuthor, deleteAuthor }
}
