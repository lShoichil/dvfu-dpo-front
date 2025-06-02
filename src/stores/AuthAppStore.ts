import { create } from 'zustand';

import AuthService from 'api/api.auth';

interface AuthState {
  isAuth: boolean;
  isAuthInProgress: boolean;
  login: (username: string, password: string) => Promise<void>;
  updateByRefresh: (navigate: (path: string) => void) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: false,
  isAuthInProgress: false,

  login: async (username, password) => {
    set({ isAuthInProgress: true });
    try {
      const resp = await AuthService.login(username, password);
      set({ isAuth: true });
      localStorage.setItem('access_token', resp.data.access_token);
      localStorage.setItem('refresh_token', resp.data.refresh_token);
    } catch (err) {
      console.error('login error', err);
    } finally {
      set({ isAuthInProgress: false });
    }
  },

  updateByRefresh: async (navigate) => {
    set({ isAuthInProgress: true });
    try {
      const refresh_token = localStorage.getItem('refresh_token') || '';
      const resp = await AuthService.refresh(refresh_token);
      set({ isAuth: true });
      localStorage.setItem('access_token', resp.data.access_token);
      localStorage.setItem('refresh_token', resp.data.refresh_token);
    } catch (err) {
      console.error('checkAuth error, go to login', err);
      navigate('/login');
    } finally {
      set({ isAuthInProgress: false });
    }
  },

  logout: async () => {
    set({ isAuthInProgress: true });
    try {
      const refresh_token = localStorage.getItem('refresh_token') || '';
      await AuthService.logout(refresh_token);
      set({ isAuth: false });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } catch (err) {
      console.error('logout error', err);
    } finally {
      set({ isAuthInProgress: false });
    }
  }
}));
