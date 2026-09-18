import { request } from './httpClient'
import type { TopAuthor } from '@/shared/types'
export const useReportsApi = () => ({
  getTopAuthors: (year: number) =>
    request<{ year: number; items: TopAuthor[] }>(`/reports/top-authors?year=${year}`),
})
