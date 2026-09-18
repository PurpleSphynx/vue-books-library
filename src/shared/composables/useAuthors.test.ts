import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useAuthors } from './useAuthors'

vi.mock('@/shared/api/useAuthorsApi', () => ({
  useAuthorsApi: () => ({
    getAuthors: vi.fn(),
    getAuthor: vi.fn(),
    createAuthor: vi.fn(),
    updateAuthor: vi.fn(),
    deleteAuthor: vi.fn(),
  }),
}))

describe('useAuthors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('mock mode', () => {
    it('getAuthors loads all authors', async () => {
      const { authors, getAuthors } = useAuthors()
      await getAuthors()
      expect(authors.value.length).toBeGreaterThan(0)
    })

    it('getAuthors filters by search', async () => {
      const { authors, getAuthors } = useAuthors()
      await getAuthors('Толстой')
      expect(authors.value.length).toBe(1)
      expect(authors.value[0].full_name).toContain('Толстой')
    })

    it('getAuthors returns empty for no match', async () => {
      const { authors, getAuthors } = useAuthors()
      await getAuthors('НесуществующийАвтор')
      expect(authors.value.length).toBe(0)
    })

    it('getAuthor returns author by id', async () => {
      const { getAuthor } = useAuthors()
      const author = await getAuthor(1)
      expect(author).toBeDefined()
      expect(author!.id).toBe(1)
    })

    it('getAuthor returns undefined for non-existent id', async () => {
      const { getAuthor } = useAuthors()
      const author = await getAuthor(9999)
      expect(author).toBeUndefined()
    })

    it('saveAuthor creates a new author', async () => {
      const instance = useAuthors()
      const result = await instance.saveAuthor({ full_name: 'Тестовый автор' })
      expect(result).toBeDefined()
      expect(result!.full_name).toBe('Тестовый автор')

      await instance.getAuthors()
      expect(instance.authors.value.some((a) => a.full_name === 'Тестовый автор')).toBe(true)
    })

    it('saveAuthor updates an existing author', async () => {
      const { saveAuthor } = useAuthors()
      const result = await saveAuthor({ full_name: 'Обновлённый автор' }, 1)
      expect(result).toBeDefined()
      expect(result!.full_name).toBe('Обновлённый автор')
    })

    it('deleteAuthor removes an author', async () => {
      const instance = useAuthors()
      await instance.getAuthors()
      const initialCount = instance.authors.value.length

      await instance.deleteAuthor(1)
      await instance.getAuthors()
      expect(instance.authors.value.length).toBe(initialCount - 1)
    })

    it('clears error on successful getAuthors', async () => {
      const instance = useAuthors()
      await instance.getAuthors()
      expect(instance.error.value).toBe('')
    })
  })
})
