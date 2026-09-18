import { ref } from 'vue'
import { useAuthorsApi } from '@/shared/api/useAuthorsApi'
import { mockAuthors } from '@/shared/mock/data'
import type { Author, AuthorInput, AuthorShort } from '@/shared/types'

export function useAuthors() {
  const authors = ref<AuthorShort[]>([])
  const loading = ref(false)
  const error = ref('')
  const api = useAuthorsApi()

  function getLocalAuthors(): Author[] {
    return structuredClone(mockAuthors)
  }

  async function getAuthors(search = '') {
    loading.value = true
    try {
      if (import.meta.env.VITE_USE_MOCK !== 'false') {
        authors.value = getLocalAuthors().filter((a) =>
          a.full_name.toLowerCase().includes(search.toLowerCase()),
        )
      } else {
        authors.value = (await api.getAuthors(search)).items
      }
    } catch {
      error.value = 'Не удалось загрузить авторов'
    } finally {
      loading.value = false
    }
  }

  async function getAuthor(id: number) {
    if (import.meta.env.VITE_USE_MOCK !== 'false') {
      return getLocalAuthors().find((a) => a.id === id)
    }
    return api.getAuthor(id)
  }

  async function saveAuthor(input: AuthorInput, id?: number) {
    if (import.meta.env.VITE_USE_MOCK !== 'false') {
      const localAuthors = getLocalAuthors()
      if (id) {
        const item = localAuthors.find((a) => a.id === id)
        if (item) item.full_name = input.full_name
        mockAuthors.length = 0
        mockAuthors.push(...localAuthors)
        return item
      }
      const item: Author = {
        id: localAuthors.length > 0 ? Math.max(...localAuthors.map((a) => a.id)) + 1 : 1,
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
