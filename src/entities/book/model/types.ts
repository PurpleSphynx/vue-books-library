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
  authors: { id: number; full_name: string }[]
}

export interface BookInput {
  title: string
  year: number
  description: string
  isbn: string
  author_ids: number[]
}
