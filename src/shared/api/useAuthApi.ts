import { request } from './httpClient'
import type { User } from '@/shared/types'
export interface LoginResult {
  token: string
  expires_at?: string
  user: User
}
export const useAuthApi = () => ({
  login: (username: string, password: string) =>
    request<LoginResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
})
