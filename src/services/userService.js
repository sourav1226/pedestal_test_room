import { apiClient, handleApiError } from './ApiService';

function mapUserFromApi(user) {
  return {
    id: String(user.id),
    roleId: user.role_id,
    roleName: user.role_name || '',
    fullName: user.full_name,
    email: user.email,
    phone: user.phone || '',
    status: user.status || 'active',
    emailVerifiedAt: user.email_verified_at || null,
    createdAt: user.created_at,
  };
}

class UserService {
  async getAllUsers(params = {}) {
    try {
      const { page = 1, limit = 10, role, status } = params;
      const queryParams = { page, limit };
      if (role) queryParams.role = role;
      if (status) queryParams.status = status;
      const response = await apiClient.get('/users', { params: queryParams });
      const data = response.data;
      return {
        success: true,
        data: {
          data: (data.users || []).map(mapUserFromApi),
          total: data.pagination?.total || 0,
          page: data.pagination?.page || 1,
          limit: data.pagination?.limit || 10,
          totalPages: Math.ceil((data.pagination?.total || 0) / (data.pagination?.limit || 10)),
        },
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async createUser(userData) {
    try {
      const payload = {
        full_name: userData.fullName,
        email: userData.email,
        phone: userData.phone || null,
        password: userData.password,
        role_id: userData.roleId,
        status: userData.status || 'active',
      };
      const response = await apiClient.post('/users', payload);
      const user = mapUserFromApi(response.data.user);
      return { success: true, data: user };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async getUserById(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      const user = mapUserFromApi(response.data.user);
      return { success: true, data: user };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async updateUser(userId, userData) {
    try {
      const payload = {};
      if (userData.fullName !== undefined) payload.full_name = userData.fullName;
      if (userData.phone !== undefined) payload.phone = userData.phone;
      if (userData.status !== undefined) payload.status = userData.status;
      const response = await apiClient.put(`/users/${userId}`, payload);
      const user = mapUserFromApi(response.data.user);
      return { success: true, data: user };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async deleteUser(userId) {
    try {
      await apiClient.delete(`/users/${userId}`);
      return { success: true, data: { success: true } };
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export const userService = new UserService();
