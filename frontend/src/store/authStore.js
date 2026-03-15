import { create } from 'zustand';

const tokenKey = 'auth_token';
const roleKey = 'auth_role';

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem(tokenKey) || '',
  userRole: localStorage.getItem(roleKey) || '',
  isAuthenticated: !!localStorage.getItem(tokenKey),

  login: (token, role) => {
    localStorage.setItem(tokenKey, token);
    localStorage.setItem(roleKey, role);
    set({ token, userRole: role, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(roleKey);
    set({ token: '', userRole: '', isAuthenticated: false });
  }
}));

export default useAuthStore;

