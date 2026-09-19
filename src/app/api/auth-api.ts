import { request } from '@/shared/api/httpClient'
import type { User } from '@/shared/types'

export interface LoginResult {
  token: string
  expires_at?: string
  user: User
}

export function login(username: string, password: string) {
  return request<LoginResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}
