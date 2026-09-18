<script setup lang="ts">
import type { AuthorShort } from '@/shared/types'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'

defineProps<{
  author: AuthorShort
  isAuthenticated: boolean
  isEditing: boolean
  editingName: string
}>()

const emit = defineEmits<{
  edit: [id: number, name: string]
  remove: [id: number]
  'update:editingName': [value: string]
  save: []
  cancel: []
}>()
</script>

<template>
  <div class="panel h-100">
    <template v-if="isEditing">
      <div class="d-flex flex-column gap-2">
        <BaseInput
          :model-value="editingName"
          label="ФИО автора"
          @update:model-value="emit('update:editingName', $event as string)"
        />
        <div class="d-flex gap-2">
          <button
            type="button"
            class="btn btn-sm btn-anim-base btn-primary"
            title="Сохранить"
            @click="emit('save')"
          >
            <i class="bi bi-check-lg"></i>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-anim-base btn-outline"
            title="Отменить"
            @click="emit('cancel')"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <RouterLink :to="`/authors/${author.id}`">
        <p class="font-display fs-3 fw-bold">{{ author.full_name }}</p>
        <p class="mt-3 small text-muted">Подробнее об авторе →</p>
      </RouterLink>

      <div v-if="isAuthenticated" class="mt-4 d-flex gap-3 small">
        <BaseButton variant="ghost" @click="emit('edit', author.id, author.full_name)">
          Изменить
        </BaseButton>
        <BaseButton variant="danger" @click="emit('remove', author.id)">
          Удалить
        </BaseButton>
      </div>
    </template>
  </div>
</template>
