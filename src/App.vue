<script setup lang="ts">
import { useAuthStore } from './stores/auth';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.checkAuth();
});
</script>

<template>
  <router-view></router-view>
</template>