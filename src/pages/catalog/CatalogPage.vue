<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useBooks } from '@/shared/composables/useBooks'
import { useAuthors } from '@/shared/composables/useAuthors'
import Modal from '@/shared/ui/Modal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'

const { books, pagination, loading, error, getBooks } = useBooks()
const { authors, getAuthors } = useAuthors()

const search = ref('')
const year = ref<number>()
const authorId = ref<number>()
const filtersOpen = ref(false)
const subscribed = ref(false)
const load = () => getBooks({ search: search.value, year: year.value, authorId: authorId.value })

function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 19) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}

onMounted(() => {
  load()
  getAuthors()
})
</script>
<template>
  <section>
    <div class="row g-4 mb-5 align-items-end">
      <div class="col-md-7">
        <p class="mb-3 small fw-semibold text-uppercase text-clay">Книжный каталог</p>
        <h1 class="font-display hero-title fw-bold">Истории, к которым хочется возвращаться.</h1>
        <p class="mt-4 text-muted">
          Находите книги, знакомьтесь с авторами и собирайте свою следующую историю.
        </p>
      </div>
      <div class="panel col-md-5">
        <BaseButton variant="ghost" class="mb-3 d-md-none" @click="filtersOpen = !filtersOpen">
          Фильтры {{ filtersOpen ? '↑' : '↓' }}
        </BaseButton>
        <div :class="[filtersOpen ? 'd-grid' : 'd-none d-md-flex', 'flex-column gap-3']">
          <BaseInput
            v-model="search"
            placeholder="Поиск по названию"
            @keyup.enter="load"
          /><BaseSelect
            v-model.number="authorId"
            placeholder="Все авторы"
            :options="authors.map((a) => ({ value: a.id, label: a.full_name }))"
          /><BaseInput v-model.number="year" type="number" placeholder="Год" /><BaseButton
            @click="load"
          >
            Найти книги
          </BaseButton>
        </div>
      </div>
    </div>
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <h2 class="font-display fs-2 fw-bold">Все книги</h2>
      <span class="small text-muted">{{ pagination.total }} {{ pluralize(pagination.total, 'результат', 'результата', 'результатов') }}</span>
    </div>
    <p v-if="error" class="panel mb-4 text-clay">{{ error }}</p>
    <div v-if="loading" class="row g-4">
      <div v-for="i in 4" :key="i" class="col-sm-6 col-lg-3">
        <div class="placeholder-glow">
          <span class="placeholder col-12" style="height: 20rem" />
        </div>
      </div>
    </div>
    <div v-else-if="books.length" class="row g-4">
      <div v-for="book in books" :key="book.id" class="col-sm-6 col-lg-3">
        <article class="book-card h-100 ">
          <RouterLink :to="`/books/${book.id}`">
            <img
              :src="book.cover_url"
              :alt="book.title"
              class="book-cover"
            />

            <div class="p-3">
              <div class="d-flex justify-content-between small text-muted">
                <span>{{ book.year }}</span>
                <span>{{ book.authors.length }} авт.</span>
              </div>

              <h3 class="mt-2 font-display fs-5 fw-bold">
                {{ book.title }}
              </h3>

              <p class="mt-1 small text-muted">
                {{ book.description }}
              </p>
            </div>
          </RouterLink>
        </article>
      </div>
    </div>

    <div v-else class="panel py-5 text-center">
      <h3 class="font-display fs-3 fw-bold">Ничего не нашли</h3>
      <p class="mt-2 text-muted">Попробуйте изменить параметры поиска.</p>
    </div>
    <div v-if="pagination.total_pages > 1" class="mt-4 d-flex justify-content-center gap-2">
      <BaseButton
        v-for="p in pagination.total_pages"
        :key="p"
        :variant="p === pagination.page ? 'action' : 'outline'"
        @click="getBooks({ search: search, year: year, authorId: authorId, page: p })"
      >
        {{ p }}
      </BaseButton>
    </div>
    <Modal :open="subscribed" @close="subscribed = false"
      ><template #title>Вы подписаны</template>
      <p class="text-muted">Мы сообщим о новых книгах автора.</p></Modal
    >
  </section>
</template>
