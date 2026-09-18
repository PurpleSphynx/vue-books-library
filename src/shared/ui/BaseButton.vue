<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'action' | 'outline' | 'ghost' | 'danger'
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    disabled?: boolean
    block?: boolean
  }>(),
  { variant: 'primary', type: 'button', loading: false, disabled: false, block: false },
)
</script>
<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="btn btn-anim-base"
    :class="[block ? 'w-100' : '', `btn-${variant}`]"
  >
    <span v-if="loading" class="me-2 spinner-border spinner-border-sm" aria-hidden="true" /><slot />
  </button>
</template>
