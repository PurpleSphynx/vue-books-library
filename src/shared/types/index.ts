export interface Pagination {
  total: number
  page: number
  per_page: number
  total_pages: number
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

export interface User {
  id: number
  username: string
  role: string
}

export interface TopAuthor {
  rank: number
  author_id: number
  full_name: string
  books_count: number
}
