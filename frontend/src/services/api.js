import axios from 'axios';
import useAuthStore from '../store/authStore.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    const method = (config.method || 'get').toLowerCase();
    if (method === 'get') {
      config.params = { ...(config.params || {}), token };
    } else {
      const original = config.data && typeof config.data === 'object' ? config.data : {};
      config.data = { ...original, token };
    }
  }
  return config;
});

export const endpoints = {
  admin: {
    signin: '/admin/signin',
    signup: '/admin/signup',
    categories: '/admin/categories',
    updateCategory: (id) => `/admin/categories/${id}`,
    customers: '/admin/customers',
    sellers: '/admin/sellers',
    orders: '/admin/orders',
    products: '/admin/products',
    profile: '/admin/profile',
    updateProfile: '/admin/profile',
    updatePassword: '/admin/profile/password'
  },
  customer: {
    signup: '/customer/signup',
    signin: '/customer/signin',
    profile: '/customer/profile',
    updateProfile: '/customer/profile',
    updatePassword: '/customer/profile/password',
    products: '/customer/products',
    product: (id) => `/customer/products/${id}`,
    categories: '/customer/categories',
    createReview: '/customer/products',
    reviews: (productId) => `/customer/reviews/${productId}`,
    orders: '/customer/orders',
    updateOrder: (orderId) => `/customer/orders/${orderId}`
  },
  seller: {
    signup: '/seller/signup',
    signin: '/seller/signin',
    profile: '/seller/profile',
    updateProfile: '/seller/profile',
    updatePassword: '/seller/profile/password',
    products: '/seller/products',
    product: (id) => `/seller/products/${id}`,
    createProduct: '/seller/products',
    updateProduct: (id) => `/seller/products/${id}`,
    deleteProduct: (id) => `/seller/products/${id}`,
    categories: '/seller/categories',
    orders: '/seller/orders',
    updateOrder: (id) => `/seller/orders/${id}`
  }
};

