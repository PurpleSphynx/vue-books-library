import { describe, expect, it, vi, beforeEach } from 'vitest'
import { request, HttpError } from './httpClient'

vi.mock('@/shared/composables/useTokenGuard', () => ({
  isTokenExpired: vi.fn().mockReturnValue(false),
}))

describe('httpClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    localStorage.clear()
  })

  it('adds bearer token and unwraps data', async () => {
    localStorage.setItem('book-token', 'abc')
    localStorage.setItem('book-token-expires-at', String(Date.now() + 86400000))
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: { id: 1 } }), { status: 200 }),
    )
    await expect(request<{ id: number }>('/books/1')).resolves.toEqual({ id: 1 })
    expect(vi.mocked(fetch).mock.calls[0][1]).toMatchObject({ headers: expect.any(Headers) })
  })

  it('normalizes API errors', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ errors: [{ field: 'title', message: 'Required' }] }), {
        status: 422,
      }),
    )
    await expect(request('/books')).rejects.toBeInstanceOf(HttpError)
  })
})
