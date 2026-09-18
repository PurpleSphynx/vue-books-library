import { describe, expect, it, vi } from 'vitest'
import { useBooksApi } from './useBooksApi'
vi.mock('./httpClient', () => ({ request: vi.fn(() => Promise.resolve({})) }))
import { request } from './httpClient'

describe('useBooksApi', () => {
  it('uses PATCH without a new cover and PUT with a cover', async () => {
    const api = useBooksApi()
    const input = { title: 'x', year: 2020, description: '', isbn: '', author_ids: [1] }
    await api.updateBook(1, input)
    expect(request).toHaveBeenCalledWith('/books/1', expect.objectContaining({ method: 'PATCH' }))
    vi.clearAllMocks()
    await api.updateBook(1, input, new File(['x'], 'cover.jpg'))
    expect(request).toHaveBeenCalledWith('/books/1', expect.objectContaining({ method: 'PUT' }))
  })
})
