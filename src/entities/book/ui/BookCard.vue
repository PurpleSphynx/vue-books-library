<script setup lang="ts">
import type { Book } from './types'

defineProps<{ book: Book }>()
</script>

<template>
  <article class="book-card">
    <RouterLink :to="`/books/${book.id}`">
      <img :src="book.cover_url" :alt="book.title" class="book-cover" />
      <div class="p-3">
        <div class="d-flex justify-content-between small text-muted">
          <span>{{ book.year }}</span>
          <span>{{ book.authors.length }} авт.</span>
        </div>
        <h3 class="mt-2 font-display fs-5 fw-bold">{{ book.title }}</h3>
        <p class="mt-1 small text-muted book-description">{{ book.description }}</p>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped>
.book-cover {
  height: 16rem;
  width: 100%;
  object-fit: contain;
  border-radius: 0.5rem;
}
.book-card {
  border: 2px solid var(--clay);
  border-radius: 1rem;
  background: var(--surface);
  padding: 0.75rem 0.75rem 0;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.book-card:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 24px rgba(37, 35, 31, 0.15);
}
.book-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
