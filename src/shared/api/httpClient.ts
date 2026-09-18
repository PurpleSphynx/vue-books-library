import type { ApiError, ApiErrorItem } from '@/shared/types'

const baseUrl = import.meta.env.VITE_API_URL || '/api/v1'
export class HttpError extends Error {
  constructor(
    public status: number,
    public errors: ApiErrorItem[],
  ) {
    super(errors.map((e) => e.message).join(', '))
  }
}
const token = () => localStorage.getItem('book-token')
export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  if (token()) headers.set('Authorization', `Bearer ${token()}`)
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers })
  if (response.status === 204) return undefined as T
  const payload = (await response.json().catch(() => ({}))) as {
    data?: T
    errors?: ApiError['errors']
  }
  if (!response.ok)
    throw new HttpError(
      response.status,
      payload.errors || [{ message: 'Не удалось выполнить запрос' }],
    )
  return (payload.data ?? payload) as T
}
