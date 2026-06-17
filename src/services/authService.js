import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  logout: async (refreshToken, accessToken) => {
    await api.post(
      '/auth/logout',
      { refresh_token: refreshToken },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  },

  getMe: async (accessToken) => {
    const { data } = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  },
};
