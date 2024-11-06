<script setup lang="ts">
import { onMounted } from 'vue';
import { useAddressStore } from '@/stores/address';
import { useAuthStore } from '@/stores/auth';

const addressStore = useAddressStore();
const authStore = useAuthStore();

onMounted(async () => {
  await addressStore.fetchAddresses();
});

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this address?')) {
    try {
      await addressStore.deleteAddress(id);
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            <li v-for="address in addressStore.addresses" :key="address.id">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center">
                      <div class="flex-shrink-0">
                        <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span class="text-gray-500">{{ address.city[0] }}</span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <h3 class="text-lg font-medium text-gray-900">
                          {{ address.street }}
                        </h3>
                        <p class="text-sm text-gray-500">
                          {{ address.city }}, {{ address.state }} {{ address.postalCode }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      @click="handleDelete(address.id)"
                      class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>