import { describe, expect, it, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './auth'
describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })
  it('logs in through mock mode', async () => {
    const store = useAuthStore()
    await store.login('reader', 'booklover')
    expect(store.isAuthenticated).toBe(true)
    expect(localStorage.getItem('book-token')).toBe('mock-token')
    store.logout()
    expect(store.isAuthenticated).toBe(false)
  })
})
