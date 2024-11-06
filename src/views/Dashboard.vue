<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAddressStore } from "@/stores/address";
import { useAuthStore } from "@/stores/auth";
import AddressMap from "@/components/AddressMap.vue";
import AddressAIAnalytics from "@/components/AddressAIAnalytics.vue";
import AddressValidation from "@/components/AddressValidation.vue";
import {
  MapPinIcon,
  ChartBarIcon,
  PlusIcon,
  XIcon,
  CheckIcon,
  AlertTriangleIcon,
} from "lucide-vue-next";
import type { Address } from "@/types";

const addressStore = useAddressStore();
const authStore = useAuthStore();

const newAddress = ref<
  Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">
>({
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
});

const validationStatus = ref<{
  isValid: boolean;
  suggestions?: string[];
} | null>(null);
const showAddressForm = ref(false);
const activeTab = ref("map");
const notification = ref({ show: false, message: "", type: "" });

onMounted(async () => {
  await addressStore.fetchAddresses();
});

const handleValidationComplete = (result: {
  isValid: boolean;
  suggestions?: string[];
}) => {
  validationStatus.value = result;
};

const handleSubmit = async () => {
  if (!validationStatus.value?.isValid) {
    showNotification("Please validate the address before submitting", "error");
    return;
  }

  try {
    await addressStore.createAddress(newAddress.value);
    newAddress.value = {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    };
    validationStatus.value = null;
    await addressStore.fetchAddresses();
    showAddressForm.value = false;
    showNotification("Address added successfully!", "success");
  } catch (error) {
    console.error("Failed to create address:", error);
    showNotification("Failed to add address. Please try again.", "error");
  }
};

const showNotification = (message: string, type: "success" | "error") => {
  notification.value = { show: true, message, type };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

const filteredAddresses = computed(() => {
  return addressStore.addresses.slice().reverse();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header
      class="flex items-center justify-between px-6 py-4 border-b bg-white"
    >
      <div class="flex items-center gap-2">
        <MapPinIcon class="w-6 h-6 text-gray-700" />
        <h1 class="text-xl font-semibold">Address Dashboard</h1>
      </div>
    </header>

    <div class="">
      <!-- Sidebar -->
      <aside class="bg-white border-r w-64 h-screen md:h-[calc(100vh-73px)]">
        <nav class="p-4 space-y-1 flex flex-start gap-2">
          <button
            @click="showAddressForm = !showAddressForm"
            class="flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <PlusIcon class="w-5 h-5 mr-2" />
            Add New Address
          </button>
          <button
            @click="activeTab = 'map'"
            :class="[
              'flex items-center w-full px-4 py-3 rounded-lg text-base font-medium transition-colors',
              activeTab === 'map'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-700 hover:bg-gray-50',
            ]"
          >
            <MapPinIcon class="w-5 h-5 mr-3" />
            Map
          </button>
          <button
            @click="activeTab = 'analytics'"
            :class="[
              'flex items-center w-full px-4 py-3 rounded-lg text-base font-medium transition-colors',
              activeTab === 'analytics'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-700 hover:bg-gray-50',
            ]"
          >
            <ChartBarIcon class="w-5 h-5 mr-3" />
            Analytics
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <!-- Notification -->
        <transition name="fade">
          <div
            v-if="notification.show"
            :class="[
              'fixed top-4 right-4 px-4 py-2 rounded-md text-white shadow-lg z-50',
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500',
            ]"
          >
            {{ notification.message }}
          </div>
        </transition>

        <!-- Address Form Dialog -->
        <transition name="slide-fade">
          <div v-if="showAddressForm" class="mb-6">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h2 class="text-xl font-semibold mb-4">Add New Address</h2>
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      for="street"
                      class="block text-sm font-medium text-gray-700"
                      >Street</label
                    >
                    <input
                      type="text"
                      id="street"
                      v-model="newAddress.street"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      for="city"
                      class="block text-sm font-medium text-gray-700"
                      >City</label
                    >
                    <input
                      type="text"
                      id="city"
                      v-model="newAddress.city"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      for="state"
                      class="block text-sm font-medium text-gray-700"
                      >State</label
                    >
                    <input
                      type="text"
                      id="state"
                      v-model="newAddress.state"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      for="postalCode"
                      class="block text-sm font-medium text-gray-700"
                      >Postal Code</label
                    >
                    <input
                      type="text"
                      id="postalCode"
                      v-model="newAddress.postalCode"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      for="country"
                      class="block text-sm font-medium text-gray-700"
                      >Country</label
                    >
                    <input
                      type="text"
                      id="country"
                      v-model="newAddress.country"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <AddressValidation
                  :address="newAddress"
                  @validation-complete="handleValidationComplete"
                />

                <div>
                  <button
                    type="submit"
                    :disabled="!validationStatus?.isValid"
                    class="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 ease-in-out"
                  >
                    <CheckIcon
                      v-if="validationStatus?.isValid"
                      class="h-5 w-5 mr-2"
                    />
                    <AlertTriangleIcon v-else class="h-5 w-5 mr-2" />
                    {{
                      validationStatus?.isValid
                        ? "Add Address"
                        : "Validate Address"
                    }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </transition>

        <!-- Tab Content -->
        <transition name="fade" mode="out-in">
          <keep-alive>
            <component
              :is="activeTab === 'map' ? AddressMap : AddressAIAnalytics"
            />
          </keep-alive>
        </transition>

        <!-- Address Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div
            v-for="address in filteredAddresses"
            :key="address.id"
            class="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
          >
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-500 mb-1">Street</p>
                <p class="text-base font-semibold">{{ address.street }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">City</p>
                <p class="text-base font-semibold">{{ address.city }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">State</p>
                <p class="text-base font-semibold">{{ address.state }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Postal Code</p>
                <p class="text-base font-semibold">{{ address.postalCode }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Country</p>
                <p class="text-base font-semibold">{{ address.country }}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Additional styles for matching the design */
:deep(.leaflet-container) {
  border-radius: 0.5rem;
}

button {
  outline: none !important;
}

.border {
  border-color: #e5e7eb;
}

.border-r {
  border-right-color: #e5e7eb;
}

.border-b {
  border-bottom-color: #e5e7eb;
}
</style>
