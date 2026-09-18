<script setup lang="ts">
import { BFormTextarea } from 'bootstrap-vue-next'
defineProps<{ modelValue?: string; label?: string; error?: string; rows?: number }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
<template>
  <div>
    <label v-if="label" class="form-label fw-semibold">{{ label }}</label
    ><BFormTextarea
      v-bind="$attrs"
      :model-value="modelValue"
      :rows="rows || 4"
      :state="error ? false : undefined"
      @update:model-value="$emit('update:modelValue', $event as string)"
    />
    <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
  </div>
</template>
