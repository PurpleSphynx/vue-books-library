import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('@/shared/composables/useTokenGuard', () => ({
  isTokenExpired: vi.fn().mockReturnValue(true),
}))

import { isTokenExpired } from '@/shared/composables/useTokenGuard'

const mockIsTokenExpired = vi.mocked(isTokenExpired)

describe('router guards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to login for auth routes when token is expired', async () => {
    mockIsTokenExpired.mockReturnValue(true)
    const { default: router } = await import('@/app/router/index')
    await router.push('/books/new')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('preserves redirect query param', async () => {
    mockIsTokenExpired.mockReturnValue(true)
    const { default: router } = await import('@/app/router/index')
    await router.push('/books/new')
    await router.isReady()
    expect(router.currentRoute.value.query.redirect).toBe('/books/new')
  })

  it('allows access to auth routes when token is valid', async () => {
    mockIsTokenExpired.mockReturnValue(false)
    const { default: router } = await import('@/app/router/index')
    await router.push('/books/new')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/books/new')
  })

  it('allows access to public routes', async () => {
    mockIsTokenExpired.mockReturnValue(true)
    const { default: router } = await import('@/app/router/index')
    await router.push('/')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('allows access to login page even without token', async () => {
    mockIsTokenExpired.mockReturnValue(true)
    const { default: router } = await import('@/app/router/index')
    await router.push('/login')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('redirects unknown routes to home', async () => {
    mockIsTokenExpired.mockReturnValue(false)
    const { default: router } = await import('@/app/router/index')
    await router.push('/nonexistent')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/')
  })
})
