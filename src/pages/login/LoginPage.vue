<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const username = ref('reader')
const password = ref('booklover')

const submit = async () => {
  await auth.login(username.value, password.value)
  if (auth.isAuthenticated) router.push(String(route.query.redirect || '/'))
}
</script>

<template>
  <div class="mx-auto py-4 py-md-5" style="max-width: 32rem">
    <div class="panel">
      <p class="small text-uppercase fw-semibold text-clay">Добро пожаловать</p>
      <h1 class="mt-2 font-display display-6 fw-bold">Войти в каталог</h1>
      <p class="mt-3 small text-muted">Демо: reader / booklover</p>
      <form class="mt-4 d-grid gap-3" @submit.prevent="submit">
        <BaseInput v-model="username" label="Логин" /><BaseInput
          v-model="password"
          label="Пароль"
          type="password"
          placeholder="Пароль"
        />
        <p v-if="auth.error" class="small text-clay">{{ auth.error }}</p>
        <BaseButton block type="submit" :loading="auth.loading">
          {{ auth.loading ? 'Входим…' : 'Войти' }}
        </BaseButton>
      </form>
    </div>
  </div>
</template>
