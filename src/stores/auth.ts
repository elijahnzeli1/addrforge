import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User, LoginCredentials, RegisterCredentials } from '../types';
import axios from '../utils/axios';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      token.value = response.data.token;
      user.value = response.data.user;
      if (token.value) {
        localStorage.setItem('token', token.value);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const { data } = await axios.post('/auth/register', {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password
      });
      
      token.value = data.token;
      user.value = data.user;
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  };

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      token.value = storedToken;
      try {
        const response = await axios.get('/auth/me');
        user.value = response.data;
      } catch (error) {
        logout();
      }
    }
  };

  return {
    user,
    token,
    login,
    register,
    logout,
    checkAuth
  };
});