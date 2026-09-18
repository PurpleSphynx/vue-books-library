<script setup lang="ts">
import type { TopAuthor } from '@/shared/types'

defineProps<{ items: TopAuthor[] }>()
</script>

<template>
  <div class="mt-4 table-responsive rounded-4 border table-wrapper">
    <table class="table table-hover align-middle mb-0">
      <thead class="small text-muted">
        <tr>
          <th scope="col" class="py-3 ps-4 text-center" style="width: 100px">
            Место
          </th>
          <th scope="col" class="py-3">
            Автор
          </th>
          <th scope="col" class="py-3 pe-4 text-center" style="width: 120px">
            Книг
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.author_id">
          <td class="py-3 ps-4 text-center">
            <span class="font-display fs-3 fw-bold">{{ item.rank }}</span>
          </td>
          <td class="py-3">
            <RouterLink :to="`/authors/${item.author_id}`" class="table-author-link">
              {{ item.full_name }}
            </RouterLink>
          </td>
          <td class="py-3 pe-4 text-center text-muted">
            {{ item.books_count }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
