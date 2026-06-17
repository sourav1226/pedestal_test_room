import { create } from 'zustand';
import { authService } from '../services/authService';

const TOKEN_KEY = 'quiz_app_access_token';
const REFRESH_KEY = 'quiz_app_refresh_token';
const USER_KEY = 'quiz_app_user';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
  accessToken: localStorage.getItem(TOKEN_KEY) || null,
  refreshToken: localStorage.getItem(REFRESH_KEY) || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.login(email, password);
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      localStorage.setItem(REFRESH_KEY, data.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      set({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        loading: false,
      });
      return data;
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    const { refreshToken, accessToken } = get();
    try {
      await authService.logout(refreshToken, accessToken);
    } catch {
      // proceed with local logout even if API call fails
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, accessToken: null, refreshToken: null });
  },

  isAdmin: () => {
    const user = get().user;
    return user && user.role_id === 1;
  },
}));
