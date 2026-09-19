export interface AuthorShort {
  id: number
  full_name: string
}

export interface Author extends AuthorShort {
  books: { id: number; title: string; year: number }[]
}

export interface AuthorInput {
  full_name: string
}
