<template>
    <div v-if="message" class="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
      {{ message }}
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    message: {
      type: String,
      required: true
    }
  })
  </script>