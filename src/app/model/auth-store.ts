import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { login as apiLogin } from '@/app/api/auth-api'
import { saveTokenExpiry, clearTokenExpiry } from '@/app/lib/token-guard'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('book-user') || 'null'))
  const loading = ref(false)
  const error = ref('')
  const isAuthenticated = computed(() => Boolean(user.value))

  async function login(username: string, password: string) {
    loading.value = true
    error.value = ''
    try {
      const result = await apiLogin(username, password)
      localStorage.setItem('book-token', result.token)
      localStorage.setItem('book-user', JSON.stringify(result.user))
      saveTokenExpiry()
      user.value = result.user
    } catch {
      error.value = 'Неверный логин или пароль'
    } finally {
      loading.value = false
    }
  }

  function logout() {
    localStorage.removeItem('book-token')
    localStorage.removeItem('book-user')
    clearTokenExpiry()
    user.value = null
  }

  return { user, loading, error, isAuthenticated, login, logout }
})
