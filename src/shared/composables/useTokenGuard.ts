const TOKEN_KEY = 'book-token'
const TOKEN_EXPIRY_KEY = 'book-token-expires-at'

const SECONDS = 1000
const MINUTES = 60 * SECONDS
const HOURS = 60 * MINUTES
const DAYS = 24 * HOURS

export const TOKEN_MAX_AGE_MS = 7 * DAYS

export function saveTokenExpiry(): void {
  const expiresAt = Date.now() + TOKEN_MAX_AGE_MS
  localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiresAt))
}

export function clearTokenExpiry(): void {
  localStorage.removeItem(TOKEN_EXPIRY_KEY)
}

export function isTokenExpired(): boolean {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return true

  const expiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY)
  if (!expiresAt) return true

  return Date.now() > Number(expiresAt)
}
