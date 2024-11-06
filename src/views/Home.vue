<content><script setup lang="ts">
    import { useAuthStore } from '@/stores/auth';
    import { useAddressStore } from '@/stores/address';
    import { onMounted } from 'vue';
    
    const authStore = useAuthStore();
    const addressStore = useAddressStore();
    
    onMounted(async () => {
      await addressStore.fetchAddresses();
    });
    </script>
    
    <template>
      <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow">
          <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900">Welcome to AddrForge</h1>
          </div>
        </header>
        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div class="px-4 py-6 sm:px-0">
            <div class="border-4 border-dashed border-gray-200 rounded-lg h-96">
              <!-- Content will go here -->
            </div>
          </div>
        </main>
      </div>
    </template></content>