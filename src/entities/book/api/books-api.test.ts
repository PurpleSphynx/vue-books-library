import { request } from '@/shared/api/httpClient'
import type { Book, BookInput, Pagination } from './types'

vi.mock('@/shared/api/httpClient', () => ({
  request: vi.fn(),
}))

import { describe, expect, it, vi } from 'vitest'
import * as api from './books-api'

describe('books-api', () => {
  it('updateBook uses PATCH without cover', async () => {
    const { request } = await import('@/shared/api/httpClient')
    vi.mocked(request).mockResolvedValue({} as never)
    await api.updateBook(1, { title: 'Test', year: 2024, description: '', isbn: '', author_ids: [] })
    expect(request).toHaveBeenCalledWith('/books/1', { method: 'PATCH', body: JSON.stringify({ title: 'Test', year: 2024, description: '', isbn: '', author_ids: [] }) })
  })

  it('updateBook uses PUT with cover', async () => {
    const { request } = await import('@/shared/api/httpClient')
    vi.mocked(request).mockResolvedValue({} as never)
    const cover = new File([''], 'cover.png', { type: 'image/png' })
    await api.updateBook(1, { title: 'Test', year: 2024, description: '', isbn: '', author_ids: [] }, cover)
    expect(request).toHaveBeenCalledWith('/books/1', { method: 'PUT', body: expect.any(FormData) })
  })
})
