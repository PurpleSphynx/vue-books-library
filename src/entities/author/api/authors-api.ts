import { request } from '@/shared/api/httpClient'
import type { Author, AuthorInput, AuthorShort, ListResponse } from './types'

export function getAuthors(search = '') {
  return request<ListResponse<AuthorShort>>(
    `/authors${search ? `?search=${encodeURIComponent(search)}` : ''}`,
  )
}

export function getAuthor(id: number) {
  return request<Author>(`/authors/${id}`)
}

export function createAuthor(input: AuthorInput) {
  return request<Author>('/authors', { method: 'POST', body: JSON.stringify(input) })
}

export function updateAuthor(id: number, input: AuthorInput) {
  return request<Author>(`/authors/${id}`, { method: 'PUT', body: JSON.stringify(input) })
}

export function deleteAuthor(id: number) {
  return request<void>(`/authors/${id}`, { method: 'DELETE' })
}
