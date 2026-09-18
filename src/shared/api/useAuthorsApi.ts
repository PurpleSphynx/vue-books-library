import { request } from './httpClient'
import type { Author, AuthorInput, AuthorShort, ListResponse } from '@/shared/types'
export const useAuthorsApi = () => ({
  getAuthors: (search = '') =>
    request<ListResponse<AuthorShort>>(
      `/authors${search ? `?search=${encodeURIComponent(search)}` : ''}`,
    ),
  getAuthor: (id: number) => request<Author>(`/authors/${id}`),
  createAuthor: (input: AuthorInput) =>
    request<Author>('/authors', { method: 'POST', body: JSON.stringify(input) }),
  updateAuthor: (id: number, input: AuthorInput) =>
    request<Author>(`/authors/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
  deleteAuthor: (id: number) => request<void>(`/authors/${id}`, { method: 'DELETE' }),
})
