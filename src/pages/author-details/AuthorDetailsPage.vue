<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthorItem } from '@/entities/author/model/use-author-item'
import Modal from '@/shared/ui/Modal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'

const route = useRoute()
const { author, fetchAuthor } = useAuthorItem()
const subscribed = ref(false)

onMounted(() => {
  fetchAuthor(Number(route.params.id))
})
</script>

<template>
  <div v-if="author" class="mx-auto" style="max-width: 56rem">
    <RouterLink to="/authors" class="small text-clay">← Все авторы</RouterLink>
    <div class="mt-4">
      <div class="d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-sm-end">
        <div>
          <p class="small text-uppercase fw-semibold text-clay">Автор</p>
          <h1 class="mt-2 font-display display-5 fw-bold">{{ author.full_name }}</h1>
        </div>
        <BaseButton @click="subscribed = true">Подписаться</BaseButton>
      </div>
      <h2 class="mt-5 font-display fs-2 fw-bold">Книги автора</h2>
      <div class="mt-3 list-group rounded-4 bg-surface">
        <RouterLink
          v-for="book in author.books"
          :key="book.id"
          :to="`/books/${book.id}`"
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          ><span class="fw-semibold">{{ book.title }}</span
          ><span class="small text-muted">{{ book.year }} →</span></RouterLink
        >
      </div>
    </div>
    <Modal :open="subscribed" @close="subscribed = false"
      ><template #title>Вы подписаны</template>
      <p class="text-muted">Демонстрационная подписка оформлена.</p></Modal
    >
  </div>
  <div v-else>Автор не найден.</div>
</template>
