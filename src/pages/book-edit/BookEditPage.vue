<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookItem } from '@/entities/book/model/use-book-item'
import { useBookMutations } from '@/entities/book/model/use-book-mutations'
import { useAuthorList } from '@/entities/author/model/use-author-list'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'
import BaseTextarea from '@/shared/ui/BaseTextarea.vue'

const route = useRoute()
const router = useRouter()
const { book: existingBook, fetchBook } = useBookItem()
const { saveBook, saving } = useBookMutations()
const { authors, fetchAuthors } = useAuthorList()

const id = route.params.id ? Number(route.params.id) : undefined
const cover = ref<File>()
const form = reactive({
  title: '',
  year: new Date().getFullYear(),
  description: '',
  isbn: '',
  author_ids: [] as number[],
})

onMounted(async () => {
  await fetchAuthors()
  if (id) {
    await fetchBook(id)
    if (existingBook.value)
      Object.assign(form, {
        title: existingBook.value.title,
        year: existingBook.value.year,
        description: existingBook.value.description,
        isbn: existingBook.value.isbn,
        author_ids: existingBook.value.authors.map((a) => a.id),
      })
  }
})

const submit = async () => {
  if (!form.title || !form.author_ids.length || (!id && !cover.value)) return
  await saveBook(form, id, cover.value)
  router.push(id ? `/books/${id}` : '/')
}
</script>

<template>
  <div class="mx-auto">
    <RouterLink to="/" class="small text-clay">← Назад</RouterLink>
    <h1 class="mt-4 font-display display-6 fw-bold">
      {{ id ? 'Редактировать книгу' : 'Новая книга' }}
    </h1>
    <form class="panel mt-4 d-grid gap-3" @submit.prevent="submit">
      <BaseInput v-model="form.title" label="Название" required />
      <BaseInput v-model.number="form.year" label="Год" type="number" required />
      <BaseSelect
        v-model="form.author_ids"
        label="Авторы"
        :options="authors.map((a) => ({ value: a.id, label: a.full_name }))"
        multiple
        required
      />
      <BaseInput v-model="form.isbn" label="ISBN" />
      <BaseTextarea v-model="form.description" label="Описание" :rows="5" />
      <BaseInput
        type="file"
        label="Обложка"
        accept="image/*"
        :required="!id"
        @update:model-value="cover = $event as File | undefined"
      />
      <BaseButton block type="submit" :loading="saving">
        {{ saving ? 'Сохраняем…' : 'Сохранить книгу' }}
      </BaseButton>
    </form>
  </div>
</template>
