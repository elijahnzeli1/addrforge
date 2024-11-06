<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { RegisterCredentials } from '@/types';

const router = useRouter();
const authStore = useAuthStore();

const credentials = ref<RegisterCredentials>({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const error = ref('');

const handleSubmit = async () => {
  try {
    if (credentials.value.password !== credentials.value.confirmPassword) {
      error.value = 'Passwords do not match';
      return;
    }
    await authStore.register(credentials.value);
    router.push('/dashboard');
  } catch (e) {
    error.value = 'Registration failed';
  }
};

const navigateToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl backdrop-blur-sm border border-gray-100">
      <div>
        <h2 class="mt-2 text-center text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Create your account
        </h2>
        <p class="mt-3 text-center text-sm text-gray-500">
          Join us and start managing your addresses
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-5">
          <div class="group">
            <label for="name" class="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
              Full Name
            </label>
            <input
              id="name"
              v-model="credentials.name"
              name="name"
              type="text"
              required
              class="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                hover:border-indigo-300 transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="John Doe"
            />
          </div>

          <div class="group">
            <label for="email-address" class="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
              Email address
            </label>
            <input
              id="email-address"
              v-model="credentials.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                hover:border-indigo-300 transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="you@example.com"
            />
          </div>

          <div class="group">
            <label for="password" class="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
              Password
            </label>
            <input
              id="password"
              v-model="credentials.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                hover:border-indigo-300 transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="••••••••"
            />
          </div>

          <div class="group">
            <label for="confirm-password" class="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              v-model="credentials.confirmPassword"
              name="confirm-password"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                hover:border-indigo-300 transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div v-if="error" 
          class="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center
            animate-fade-in shadow-sm">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl
              text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200
              hover:shadow-lg hover:-translate-y-0.5"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-indigo-300 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
              </svg>
            </span>
            Create Account
          </button>
        </div>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          Already have an account?
          <button
            @click="navigateToLogin"
            class="ml-1 font-medium text-indigo-600 hover:text-purple-600 transition-colors duration-200 
              focus:outline-none hover:underline"
            type="button"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>