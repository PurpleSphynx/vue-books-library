<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReports } from '@/shared/composables/useReports'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'

const year = ref(new Date().getFullYear())
const { items: report, getTopAuthors } = useReports()

onMounted(() => getTopAuthors(year.value))

const load = () => getTopAuthors(year.value)
</script>

<template>
  <section class="mx-auto">
    <p class="small text-uppercase fw-semibold text-clay">Аналитика каталога</p>
    <div
      class="mt-2 d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-sm-end"
    >
      <h1 class="font-display display-6 fw-bold">Топ авторов</h1>
      <div class="d-flex gap-2 align-items-end">
        <BaseInput
          v-model.number="year"
          class="year-input"
          type="number"
          min="1900"
          max="2100"
        /><BaseButton @click="load">Обновить</BaseButton>
      </div>
    </div>
    <p class="mt-3 text-muted">Авторы, выпустившие больше всего книг в {{ year }} году.</p>
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
          <tr v-for="item in report" :key="item.author_id">
            <td class="py-3 ps-4 text-center">
              <span class="font-display fs-3 fw-bold">
                {{ item.rank }}
              </span>
            </td>

            <td class="py-3">
              <RouterLink
                :to="`/authors/${item.author_id}`"
                class="table-author-link"
              >
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

  </section>
</template>
