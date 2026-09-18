<script setup lang="ts">
import BaseButton from './BaseButton.vue'
defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body"
    ><div
      v-if="open"
      class="modal-backdrop-custom position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      @click.self="$emit('close')"
    >
      <div class="panel modal-card">
        <div class="mb-4 d-flex align-items-start justify-content-between">
          <h2 class="font-display fs-3 fw-bold"><slot name="title">Готово</slot></h2>
          <BaseButton variant="ghost" aria-label="Закрыть" @click="$emit('close')">×</BaseButton>
        </div>
        <slot /><BaseButton class="mt-4" block @click="$emit('close')">Понятно</BaseButton>
      </div>
    </div></Teleport
  >
</template>
