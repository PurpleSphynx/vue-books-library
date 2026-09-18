import type { Author, Book, TopAuthor, User } from '@/shared/types'
const cover = (name: string) => `/mock-covers/${name}.svg`
export const mockAuthors: Author[] = [
  {
    id: 1,
    full_name: 'Марина Цветаева',
    books: [
      { id: 1, title: 'Вечерний свет', year: 1922 },
      { id: 2, title: 'Дом у моря', year: 1924 },
    ],
  },
  { id: 2, full_name: 'Лев Толстой', books: [{ id: 3, title: 'После бала', year: 1903 }] },
  { id: 3, full_name: 'Анна Ахматова', books: [{ id: 4, title: 'Белая стая', year: 1917 }] },
]
export const mockBooks: Book[] = [
  {
    id: 1,
    title: 'Вечерний свет',
    year: 1922,
    description: 'Сборник стихотворений о времени, памяти и тихой красоте повседневности.',
    isbn: '978-5-17-123456-7',
    cover_url: cover('evening-light'),
    authors: [{ id: 1, full_name: 'Марина Цветаева' }],
  },
  {
    id: 2,
    title: 'Дом у моря',
    year: 1924,
    description: 'История возвращения к себе и к месту, которое всегда ждало.',
    isbn: '978-5-17-765432-1',
    cover_url: cover('house-by-sea'),
    authors: [{ id: 1, full_name: 'Марина Цветаева' }],
  },
  {
    id: 3,
    title: 'После бала',
    year: 1903,
    description: 'Рассказ о случайной встрече, изменившей взгляд на привычный мир.',
    isbn: '978-5-17-111222-3',
    cover_url: cover('after-the-ball'),
    authors: [{ id: 2, full_name: 'Лев Толстой' }],
  },
  {
    id: 4,
    title: 'Белая стая',
    year: 1917,
    description: 'Поэзия внутренней свободы и наблюдений за эпохой.',
    isbn: '978-5-17-333444-5',
    cover_url: cover('white-flock'),
    authors: [{ id: 3, full_name: 'Анна Ахматова' }],
  },
]
export const mockTop: TopAuthor[] = mockAuthors.map((a, i) => ({
  rank: i + 1,
  author_id: a.id,
  full_name: a.full_name,
  books_count: a.books.length,
}))
export const mockUser: User = { id: 1, username: 'reader', role: 'user' }
