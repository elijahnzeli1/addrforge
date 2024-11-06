<template>
    <div class="space-y-2">
      <label :for="id" class="block text-sm font-medium text-gray-700">
        {{ label }}
      </label>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        :disabled="disabled"
        :required="required"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    id: string
    label: string
    modelValue: string
    type?: string
    disabled?: boolean
    required?: boolean
  }>()
  
  defineEmits<{
    'update:modelValue': [value: string]
  }>()
  </script>