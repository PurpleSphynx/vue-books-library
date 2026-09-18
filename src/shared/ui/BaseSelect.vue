<script setup lang="ts">
import { BFormSelect } from 'bootstrap-vue-next'
type Option = { value: string | number; text?: string; label?: string }
defineProps<{
  modelValue?: string | number | number[]
  options: Option[]
  label?: string
  placeholder?: string
  error?: string
  multiple?: boolean
  disabled?: boolean
}>()
defineEmits<{ 'update:modelValue': [value: string | number | number[]] }>()
</script>
<template>
  <div>
    <label v-if="label" class="form-label fw-semibold">{{ label }}</label
    ><BFormSelect
      v-bind="$attrs"
      :model-value="modelValue"
      :options="
        options.map((option) => ({ value: option.value, text: option.text || option.label }))
      "
      :multiple="multiple"
      :disabled="disabled"
      :state="error ? false : undefined"
      @update:model-value="$emit('update:modelValue', $event as string | number | number[])"
    />
    <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
    <div v-else-if="placeholder" class="form-text">{{ placeholder }}</div>
  </div>
</template>
