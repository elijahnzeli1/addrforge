<script setup lang="ts">
import { ref } from 'vue';
import type { Address } from '@/types';

const props = defineProps<{
  address: Partial<Address>;
}>();

const emit = defineEmits<{
  (e: 'validation-complete', result: { isValid: boolean; suggestions?: string[] }): void;
}>();

const loading = ref(false);
const validationResult = ref<{ isValid: boolean; suggestions?: string[] } | null>(null);

const validateAddress = async () => {
  loading.value = true;
  try {
    // Simulate AI-powered address validation
    const response = await new Promise<{ isValid: boolean; suggestions?: string[] }>(resolve => {
      setTimeout(() => {
        const isValid = Math.random() > 0.3; // Simulate validation
        const suggestions = !isValid ? [
          `${props.address.street} (Verified)`,
          `${props.address.street} Street`,
          `${props.address.street} Avenue`
        ] : undefined;
        
        resolve({ isValid, suggestions });
      }, 1000);
    });

    validationResult.value = response;
    emit('validation-complete', response);
  } catch (error) {
    console.error('Address validation failed:', error);
    validationResult.value = { isValid: false };
    emit('validation-complete', { isValid: false });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold">Address Validation</h3>
      <button
        @click="validateAddress"
        :disabled="loading"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {{ loading ? 'Validating...' : 'Validate' }}
      </button>
    </div>

    <div v-if="validationResult" class="mt-4">
      <div
        :class="[
          'p-4 rounded-md',
          validationResult.isValid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        ]"
      >
        <p class="font-medium">
          {{ validationResult.isValid ? 'Address is valid' : 'Address needs review' }}
        </p>
        
        <div v-if="validationResult.suggestions" class="mt-3">
          <p class="font-medium mb-2">Suggested corrections:</p>
          <ul class="list-disc list-inside space-y-1">
            <li v-for="(suggestion, index) in validationResult.suggestions" :key="index">
              {{ suggestion }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>