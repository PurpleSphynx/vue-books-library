<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/app/model/auth-store'
import BaseButton from '@/shared/ui/BaseButton.vue'
const auth = useAuthStore()
const open = ref(false)
</script>
<template>
  <header class="border-bottom bg-surface">
    <div class="container">
      <div class="navbar navbar-expand-md">
        <RouterLink to="/" class="navbar-brand font-display fw-bold fs-3"
          >Лист<span class="text-clay">.</span></RouterLink
        ><BaseButton variant="outline" class="d-md-none ms-auto" @click="open = !open"
          >Меню</BaseButton
        >
        <nav
          :class="[
            open ? 'd-flex' : 'd-none',
            'navbar-collapse start-0 end-0 flex-column align-items-stretch gap-2 bg-surface p-3 d-md-flex flex-md-row align-items-md-center border-md-0 position-md-static',
          ]"
        >
          <RouterLink class="nav-link-editorial me-md-3" to="/authors">Авторы</RouterLink
          ><RouterLink class="nav-link-editorial me-auto" to="/reports/top-authors"
            >Отчёт</RouterLink
          ><template v-if="auth.isAuthenticated"
            ><RouterLink class="btn btn-primary me-2" to="/books/new">Добавить книгу</RouterLink
            ><BaseButton variant="ghost" @click="auth.logout">Выйти</BaseButton></template
          ><RouterLink v-else class="btn btn-outline" to="/login">Войти</RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>
