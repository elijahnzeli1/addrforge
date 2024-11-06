// src/types/index.ts
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    password: string; // Added for backend
  }
  
  export interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface LoginCredentials {
    email: string;
    password: string;
  }  
  
  export interface RegisterCredentials {
    name: string;
   email: string;
  password: string;
  confirmPassword: string;
}