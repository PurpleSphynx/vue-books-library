export interface AuthorShort {
  id: number
  full_name: string
}
export interface BookShort {
  id: number
  title: string
  year: number
}
export interface Book {
  id: number
  title: string
  year: number
  description: string
  isbn: string
  cover_url: string
  authors: AuthorShort[]
}
export interface Author extends AuthorShort {
  books: BookShort[]
}
export interface Pagination {
  total: number
  page: number
  per_page: number
  total_pages: number
}
export interface BookInput {
  title: string
  year: number
  description: string
  isbn: string
  author_ids: number[]
}
export interface BookFormData extends BookInput {
  cover?: File
}
export interface AuthorInput {
  full_name: string
}
export interface TopAuthor {
  rank: number
  author_id: number
  full_name: string
  books_count: number
}
export interface User {
  id: number
  username: string
  role: string
}
export interface ApiErrorItem {
  field?: string
  message: string
}
export interface ApiError {
  success: false
  errors: ApiErrorItem[]
}
export interface ListResponse<T> {
  success: boolean
  data: { items: T[]; pagination: Pagination }
}
