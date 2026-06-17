import { apiClient } from './ApiService';

export const authService = {
  login: async (email, password) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },

  logout: async (refreshToken) => {
    await apiClient.post('/auth/logout', { refresh_token: refreshToken });
  },

  getMe: async () => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
};
