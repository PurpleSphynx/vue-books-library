<script setup lang="ts">
import { BFormFile, BFormInput } from 'bootstrap-vue-next'
type InputValue = string | number | File | undefined
const props = withDefaults(
  defineProps<{
    modelValue?: InputValue
    label?: string
    hint?: string
    error?: string
    type?: string
    modelModifiers?: { number?: boolean }
  }>(),
  { type: 'text', modelModifiers: () => ({}) },
)
defineEmits<{ 'update:modelValue': [value: InputValue] }>()
</script>
<template>
  <div>
    <label v-if="label" class="form-label fw-semibold" :for="String($attrs.id || '')">{{
      label
    }}</label
    ><BFormFile
      v-if="type === 'file'"
      v-bind="$attrs"
      :model-value="modelValue as File | undefined"
      :state="!error"
      @update:model-value="$emit('update:modelValue', $event as File | undefined)"
    /><BFormInput
      v-else
      v-bind="$attrs"
      :model-value="modelValue"
      :type="type"
      :state="error ? false : undefined"
      @update:model-value="
        $emit(
          'update:modelValue',
          props.modelModifiers.number
            ? $event === ''
              ? undefined
              : Number($event)
            : ($event as string | number | undefined),
        )
      "
    />
    <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
    <div v-else-if="hint" class="form-text">{{ hint }}</div>
  </div>
</template>
