<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTopAuthors } from './use-top-authors'
import ReportsTable from './ui/ReportsTable.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'

const year = ref(new Date().getFullYear())
const { items: report, fetchTopAuthors } = useTopAuthors()

onMounted(() => fetchTopAuthors(year.value))

const load = () => fetchTopAuthors(year.value)
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
    <ReportsTable :items="report" />
  </section>
</template>
