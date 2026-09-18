import { request } from './httpClient'
import type { Book, BookInput, Pagination } from '@/shared/types'
export interface BookQuery {
  page?: number
  perPage?: number
  authorId?: number
  year?: number
  search?: string
}
const query = (q: BookQuery) => {
  const p = new URLSearchParams()
  if (q.page) p.set('page', `${q.page}`)
  if (q.perPage) p.set('per-page', `${q.perPage}`)
  if (q.authorId) p.set('author_id', `${q.authorId}`)
  if (q.year) p.set('year', `${q.year}`)
  if (q.search) p.set('search', q.search)
  return p.toString() ? `?${p}` : ''
}
const form = (input: BookInput, cover?: File) => {
  const f = new FormData()
  Object.entries(input).forEach(([key, value]) =>
    f.append(key, Array.isArray(value) ? JSON.stringify(value) : `${value}`),
  )
  if (cover) f.append('cover', cover)
  return f
}
export const useBooksApi = () => ({
  getBooks: (q: BookQuery = {}) =>
    request<{ items: Book[]; pagination: Pagination }>(`/books${query(q)}`),
  getBook: (id: number) => request<Book>(`/books/${id}`),
  createBook: (input: BookInput, cover: File) =>
    request<Book>('/books', { method: 'POST', body: form(input, cover) }),
  updateBook: (id: number, input: BookInput, cover?: File) =>
    cover
      ? request<Book>(`/books/${id}`, { method: 'PUT', body: form(input, cover) })
      : request<Book>(`/books/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  deleteBook: (id: number) => request<void>(`/books/${id}`, { method: 'DELETE' }),
})
