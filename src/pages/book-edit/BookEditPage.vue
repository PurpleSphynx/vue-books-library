<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooks } from '@/shared/composables/useBooks'
import { mockAuthors } from '@/shared/mock/data'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'
import BaseTextarea from '@/shared/ui/BaseTextarea.vue'

const route = useRoute()
const router = useRouter()
const { getBook, saveBook } = useBooks()

const id = route.params.id ? Number(route.params.id) : undefined
const loading = ref(false)
const cover = ref<File>()
const form = reactive({
  title: '',
  year: new Date().getFullYear(),
  description: '',
  isbn: '',
  author_ids: [] as number[],
})
const authorOptions = mockAuthors.map((author) => ({ value: author.id, label: author.full_name }))

onMounted(async () => {
  if (id) {
    const b = await getBook(id)
    if (b)
      Object.assign(form, {
        title: b.title,
        year: b.year,
        description: b.description,
        isbn: b.isbn,
        author_ids: b.authors.map((a) => a.id),
      })
  }
})

const submit = async () => {
  if (!form.title || !form.author_ids.length || (!id && !cover.value)) return
  loading.value = true
  await saveBook(form, id, cover.value)
  loading.value = false
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
        :options="authorOptions"
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
      <BaseButton block type="submit" :loading="loading">
        {{ loading ? 'Сохраняем…' : 'Сохранить книгу' }}
      </BaseButton>
    </form>
  </div>
</template>
