import { create } from 'zustand';

interface AuthState {
  isAuth: boolean;
  isAuthInProgress: boolean;

  setAuth: (authStatus: boolean) => void;
  setAuthInProgress: (inProgress: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: false,
  isAuthInProgress: false,

  setAuth: (authStatus: boolean) => set({ isAuth: authStatus }),
  setAuthInProgress: (inProgress: boolean) => set({ isAuthInProgress: inProgress })
}));
