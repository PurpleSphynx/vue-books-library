<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthors } from '@/shared/composables/useAuthors'
import { useAuthStore } from '@/shared/stores/auth'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'

const search = ref('')
const fullName = ref('')
const editingId = ref<number>()
const auth = useAuthStore()
const { authors, getAuthors, saveAuthor, deleteAuthor } = useAuthors()

onMounted(() => getAuthors())

const filter = () => getAuthors(search.value)
const addAuthor = async () => {
  if (!fullName.value.trim()) return
  await saveAuthor({ full_name: fullName.value.trim() }, editingId.value)
  fullName.value = ''
  editingId.value = undefined
  await getAuthors(search.value)
}
const editAuthor = (id: number, name: string) => {
  editingId.value = id
  fullName.value = name
}
const removeAuthor = async (id: number) => {
  if (window.confirm('Удалить автора?')) {
    await deleteAuthor(id)
    await getAuthors(search.value)
  }
}
</script>

<template>
  <section>
    <div
      class="mb-5 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-sm-end"
    >
      <div>
        <p class="small text-uppercase fw-semibold text-clay">Коллекция голосов</p>
        <h1 class="mt-2 font-display display-6 fw-bold">Авторы</h1>
      </div>
      <BaseInput
        v-model="search"
        class="author-search"
        placeholder="Найти автора"
        @keyup.enter="filter"
      />
    </div>
    <form
      v-if="auth.isAuthenticated"
      class="panel mb-4 d-flex flex-column flex-sm-row gap-3"
      @submit.prevent="addAuthor"
    >
      <BaseInput
        v-model="fullName"
        label="ФИО автора"
        :placeholder="editingId ? 'Новое имя автора' : 'ФИО нового автора'"
      /><BaseButton type="submit" class="w-auto">
        {{ editingId ? 'Сохранить' : 'Добавить автора' }}
      </BaseButton>
    </form>
    <div class="row g-4">
      <div v-for="author in authors" :key="author.id" class="panel col-sm-6 col-lg-4">
        <RouterLink :to="`/authors/${author.id}`"
          ><p class="font-display fs-3 fw-bold">{{ author.full_name }}</p>
          <p class="mt-3 small text-muted">Подробнее об авторе →</p></RouterLink
        >
        <div v-if="auth.isAuthenticated" class="mt-4 d-flex gap-3 small">
          <BaseButton variant="ghost" @click="editAuthor(author.id, author.full_name)">
            Изменить </BaseButton
          ><BaseButton variant="danger" @click="removeAuthor(author.id)">Удалить</BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
