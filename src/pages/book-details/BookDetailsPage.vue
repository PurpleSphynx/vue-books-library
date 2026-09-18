<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useBooks } from '@/shared/composables/useBooks'
import { useAuthStore } from '@/shared/stores/auth'
import Modal from '@/shared/ui/Modal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'

const route = useRoute()
const auth = useAuthStore()
const { getBook } = useBooks()
const book = ref<Awaited<ReturnType<typeof getBook>>>()
const subscribed = ref(false)

onMounted(async () => {
  book.value = await getBook(Number(route.params.id))
})
</script>

<template>
  <div v-if="book" class="mx-auto"">
    <RouterLink to="/" class="small text-clay">← Назад к каталогу</RouterLink>
    <div class="mt-4 row g-4 g-md-5">
      <div class="col-md-4">
        <img :src="book.cover_url" :alt="book.title" class="book-detail-cover d-block rounded-4 shadow" />
      </div>
      <div class="col-md-8">
        <p class="small text-uppercase fw-semibold text-clay">{{ book.year }}</p>
        <h1 class="mt-2 font-display display-4 fw-bold">{{ book.title }}</h1>
        <div class="mt-3 d-flex flex-wrap gap-2">
          <RouterLink
            v-for="author in book.authors"
            :key="author.id"
            :to="`/authors/${author.id}`"
            class="badge rounded-pill text-clay bg-clay-soft px-3 py-2"
            >{{ author.full_name }}</RouterLink
          >
        </div>
        <p class="mt-4 fs-5 lh-lg text-muted">{{ book.description }}</p>
        <p class="mt-4 small text-muted">ISBN: {{ book.isbn }}</p>
        <div class="mt-4 d-flex gap-2">
          <BaseButton @click="subscribed = true">Подписаться на автора</BaseButton>
          <RouterLink
            v-if="auth.isAuthenticated"
            :to="`/books/${book.id}/edit`"
            class="btn btn-outline"
            >Редактировать</RouterLink
          >
        </div>
      </div>
    </div>
    <Modal :open="subscribed" @close="subscribed = false"
      ><template #title>Вы подписаны</template>
      <p class="text-muted">Демонстрационная подписка оформлена.</p></Modal
    >
  </div>
  <div v-else class="py-5 text-center">Книга не найдена.</div>
</template>

<style scoped>
.book-detail-cover {
  width: 100%;
  max-height: 36rem;
  object-fit: contain;
  transition: transform 0.3s ease;
}
.book-detail-cover:hover {
  transform: scale(1.08);
}
</style>
