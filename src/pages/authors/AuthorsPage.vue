<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthors } from '@/shared/composables/useAuthors'
import { useAuthStore } from '@/shared/stores/auth'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'

const search = ref('')
const newAuthorName = ref('')
const editingId = ref<number>()
const editingName = ref('')
const auth = useAuthStore()
const { authors, getAuthors, saveAuthor, deleteAuthor } = useAuthors()

onMounted(() => getAuthors())

const filter = () => getAuthors(search.value)

const addAuthor = async () => {
  if (!newAuthorName.value.trim()) return
  await saveAuthor({ full_name: newAuthorName.value.trim() })
  newAuthorName.value = ''
  await getAuthors(search.value)
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
  await getAuthors(search.value)
}

const cancelEdit = () => {
  editingId.value = undefined
  editingName.value = ''
}

const removeAuthor = async (id: number) => {
  if (window.confirm('Удалить автора?')) {
    await deleteAuthor(id)
    await getAuthors(search.value)
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
      <div
        v-for="author in authors"
        :key="author.id"
        class="col-sm-6 col-lg-4"
      >
        <div class="panel h-100">
          <template v-if="editingId === author.id">
            <div class="d-flex flex-column gap-2">
              <BaseInput v-model="editingName" label="ФИО автора" />

              <div class="d-flex gap-2">
                <button
                  type="button"
                  class="btn btn-sm btn-anim-base btn-primary"
                  title="Сохранить"
                  @click="saveEdit"
                >
                  <i class="bi bi-check-lg"></i>
                </button>

                <button
                  type="button"
                  class="btn btn-sm btn-anim-base btn-outline"
                  title="Отменить"
                  @click="cancelEdit"
                >
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
          </template>

          <template v-else>
            <RouterLink :to="`/authors/${author.id}`">
              <p class="font-display fs-3 fw-bold">
                {{ author.full_name }}
              </p>

              <p class="mt-3 small text-muted">
                Подробнее об авторе →
              </p>
            </RouterLink>

            <div
              v-if="auth.isAuthenticated"
              class="mt-4 d-flex gap-3 small"
            >
              <BaseButton
                variant="ghost"
                @click="startEdit(author.id, author.full_name)"
              >
                Изменить
              </BaseButton>

              <BaseButton
                variant="danger"
                @click="removeAuthor(author.id)"
              >
                Удалить
              </BaseButton>
            </div>
          </template>
        </div>
      </div>
    </div>

  </section>
</template>
