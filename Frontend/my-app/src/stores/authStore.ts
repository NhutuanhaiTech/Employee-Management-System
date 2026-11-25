// src/stores/authStore.ts
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  role: string | null;
  userInfo: any | null;
  isAuthenticated: boolean;
  setAuth: (token: string, role: string, userInfo: any) => void; 
  logout: () => void;
}

const savedUserInfo = localStorage.getItem('userInfo');
const initialUserInfo = savedUserInfo ? JSON.parse(savedUserInfo) : null;

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('accessToken') || null,
  role: localStorage.getItem('userRole') || null,
  userInfo: initialUserInfo,
  isAuthenticated: !!localStorage.getItem('accessToken'),

  setAuth: (token, role, userInfo) => {
    console.log("=== ZUSTAND ĐANG LƯU DỮ LIỆU ===");
    console.log("Token lưu vào:", token);
    console.log("Role lưu vào:", role);
    console.log("UserInfo lưu vào:", userInfo);

    localStorage.setItem('accessToken', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    set({ token, role, userInfo, isAuthenticated: true }); 
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userInfo');
    set({ token: null, role: null, userInfo: null, isAuthenticated: false }); 
  }
}));