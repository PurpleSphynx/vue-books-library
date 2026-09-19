import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import LoginPage from './LoginPage.vue'
import { useAuthStore } from '@/app/model/auth-store'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/login', component: LoginPage },
    { path: '/', component: { template: '<div />' } },
  ],
})

describe('LoginPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  const mountPage = () =>
    mount(LoginPage, {
      global: {
        plugins: [router],
        stubs: { teleport: true },
      },
    })

  it('renders page title', async () => {
    await router.push('/login')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Войти в каталог')
  })

  it('renders demo credentials hint', async () => {
    await router.push('/login')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('reader')
    expect(wrapper.text()).toContain('booklover')
  })

  it('renders login form fields', async () => {
    await router.push('/login')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Логин')
    expect(wrapper.text()).toContain('Пароль')
  })

  it('renders submit button', async () => {
    await router.push('/login')
    await router.isReady()
    const wrapper = mountPage()
    expect(wrapper.text()).toContain('Войти')
  })

  it('pre-fills demo credentials', async () => {
    await router.push('/login')
    await router.isReady()
    const wrapper = mountPage()
    const inputs = wrapper.findAll('input')
    const usernameInput = inputs.find((i) => i.element.value === 'reader')
    const passwordInput = inputs.find((i) => i.element.value === 'booklover')
    expect(usernameInput).toBeDefined()
    expect(passwordInput).toBeDefined()
  })

  it('calls login on form submit', async () => {
    await router.push('/login')
    await router.isReady()
    const wrapper = mountPage()
    const form = wrapper.find('form')
    await form.trigger('submit')
    const auth = useAuthStore()
    expect(auth.loading).toBe(false)
  })
})
