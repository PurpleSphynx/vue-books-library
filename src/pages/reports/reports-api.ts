import { request } from '@/shared/api/httpClient'
import type { TopAuthor } from '@/shared/types'

export function getTopAuthors(year: number) {
  return request<{ year: number; items: TopAuthor[] }>(`/reports/top-authors?year=${year}`)
}
