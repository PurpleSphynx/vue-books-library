import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useReports } from './useReports'

vi.mock('@/shared/api/useReportsApi', () => ({
  useReportsApi: () => ({
    getTopAuthors: vi.fn(),
  }),
}))

describe('useReports', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('mock mode', () => {
    it('getTopAuthors loads report items', async () => {
      const { items, getTopAuthors } = useReports()
      await getTopAuthors(2024)
      expect(items.value.length).toBeGreaterThan(0)
    })

    it('getTopAuthors items have required fields', async () => {
      const { items, getTopAuthors } = useReports()
      await getTopAuthors(2024)
      items.value.forEach((item) => {
        expect(item).toHaveProperty('rank')
        expect(item).toHaveProperty('author_id')
        expect(item).toHaveProperty('full_name')
        expect(item).toHaveProperty('books_count')
      })
    })

    it('getTopAuthors items are sorted by rank', async () => {
      const { items, getTopAuthors } = useReports()
      await getTopAuthors(2024)
      const ranks = items.value.map((i) => i.rank)
      expect(ranks).toEqual([...ranks].sort((a, b) => a - b))
    })
  })
})
