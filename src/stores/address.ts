import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Address } from '../types';
import axios from '../utils/axios';

export const useAddressStore = defineStore('address', () => {
  const addresses = ref<Address[]>([]);
  const loading = ref(false);

  const fetchAddresses = async () => {
    loading.value = true;
    try {
      const response = await axios.get('/addresses');
      addresses.value = response.data;
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const createAddress = async (addressData: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await axios.post('/addresses', addressData);
      addresses.value.push(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create address:', error);
      throw error;
    }
  };

  const updateAddress = async (id: string, addressData: Partial<Address>) => {
    try {
      const response = await axios.put(`/addresses/${id}`, addressData);
      const index = addresses.value.findIndex(a => a.id === id);
      if (index !== -1) {
        addresses.value[index] = response.data;
      }
      return response.data;
    } catch (error) {
      console.error('Failed to update address:', error);
      throw error;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      await axios.delete(`/addresses/${id}`);
      addresses.value = addresses.value.filter(a => a.id !== id);
    } catch (error) {
      console.error('Failed to delete address:', error);
      throw error;
    }
  };

  return {
    addresses,
    loading,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress
  };
});