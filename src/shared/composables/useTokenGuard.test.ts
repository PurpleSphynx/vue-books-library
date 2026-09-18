import { describe, expect, it, beforeEach } from 'vitest'
import {
  isTokenExpired,
  saveTokenExpiry,
  clearTokenExpiry,
  TOKEN_MAX_AGE_MS,
} from './useTokenGuard'

describe('useTokenGuard', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('TOKEN_MAX_AGE_MS equals 7 days', () => {
    const SECONDS = 1000
    const MINUTES = 60 * SECONDS
    const HOURS = 60 * MINUTES
    const DAYS = 24 * HOURS
    expect(TOKEN_MAX_AGE_MS).toBe(7 * DAYS)
  })

  it('isTokenExpired returns true when no token exists', () => {
    expect(isTokenExpired()).toBe(true)
  })

  it('isTokenExpired returns true when no expiry is stored', () => {
    localStorage.setItem('book-token', 'abc')
    expect(isTokenExpired()).toBe(true)
  })

  it('isTokenExpired returns false when token and valid expiry exist', () => {
    localStorage.setItem('book-token', 'abc')
    const future = Date.now() + 60_000
    localStorage.setItem('book-token-expires-at', String(future))
    expect(isTokenExpired()).toBe(false)
  })

  it('isTokenExpired returns true when expiry is in the past', () => {
    localStorage.setItem('book-token', 'abc')
    const past = Date.now() - 1_000
    localStorage.setItem('book-token-expires-at', String(past))
    expect(isTokenExpired()).toBe(true)
  })

  it('saveTokenExpiry stores correct expiry timestamp', () => {
    const before = Date.now()
    saveTokenExpiry()
    const after = Date.now()
    const stored = Number(localStorage.getItem('book-token-expires-at'))
    expect(stored).toBeGreaterThanOrEqual(before + TOKEN_MAX_AGE_MS)
    expect(stored).toBeLessThanOrEqual(after + TOKEN_MAX_AGE_MS)
  })

  it('clearTokenExpiry removes the expiry from localStorage', () => {
    localStorage.setItem('book-token-expires-at', '123')
    clearTokenExpiry()
    expect(localStorage.getItem('book-token-expires-at')).toBeNull()
  })
})
