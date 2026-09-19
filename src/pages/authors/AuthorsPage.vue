<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthorList } from '@/entities/author/model/use-author-list'
import { useAuthorMutations } from '@/entities/author/model/use-author-mutations'
import { useAuthStore } from '@/app/model/auth-store'
import AuthorCard from '@/entities/author/ui/AuthorCard.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'

const search = ref('')
const newAuthorName = ref('')
const editingId = ref<number>()
const editingName = ref('')
const auth = useAuthStore()
const { authors, fetchAuthors } = useAuthorList()
const { saveAuthor, removeAuthor } = useAuthorMutations()

onMounted(() => fetchAuthors())

const filter = () => fetchAuthors(search.value)

const addAuthor = async () => {
  if (!newAuthorName.value.trim()) return
  await saveAuthor({ full_name: newAuthorName.value.trim() })
  newAuthorName.value = ''
  await fetchAuthors(search.value)
}

const startEdit = (id: number, name: string) => {
  editingId.value = id
  editingName.value = name
}

const saveEdit = async () => {
  if (!editingName.value.trim() || editingId.value === undefined) return
  await saveAuthor({ full_name: editingName.value.trim() }, editingId.value)
  editingId.value = undefined
  editingName.value = ''
  await fetchAuthors(search.value)
}

const cancelEdit = () => {
  editingId.value = undefined
  editingName.value = ''
}

const removeAuthorHandler = async (id: number) => {
  if (window.confirm('Удалить автора?')) {
    await removeAuthor(id)
    await fetchAuthors(search.value)
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
        v-model="newAuthorName"
        label="ФИО автора"
        placeholder="ФИО нового автора"
      />
      <BaseButton type="submit" class="w-auto mt-auto">Добавить автора</BaseButton>
    </form>
    <div class="row g-4">
      <div v-for="author in authors" :key="author.id" class="col-sm-6 col-lg-4">
        <AuthorCard
          :author="author"
          :is-authenticated="auth.isAuthenticated"
          :is-editing="editingId === author.id"
          :editing-name="editingName"
          class="h-100"
          @edit="startEdit"
          @remove="removeAuthorHandler"
          @update:editing-name="editingName = $event"
          @save="saveEdit"
          @cancel="cancelEdit"
        />
      </div>
    </div>
  </section>
</template>
