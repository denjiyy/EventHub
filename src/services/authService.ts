import { apiClient } from './api';

export class AuthService {
  static async register(email, password, firstName, lastName, phoneNumber) {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
    });
    apiClient.setToken(response.token);
    return response;
  }

  static async login(email, password) {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    apiClient.setToken(response.token);
    return response;
  }

  static async getProfile() {
    try {
      return await apiClient.get('/auth/profile');
    } catch (error) {
      if (error.message && (error.message.includes('401') || error.message.includes('400'))) {
        this.logout();
      }
      throw error;
    }
  }

  static async updateProfile(data) {
    return apiClient.put('/auth/profile', data);
  }

  static logout() {
    apiClient.clearToken();
  }

  static isAuthenticated() {
    return !!apiClient.getToken();
  }
  
  static getToken() {
    return apiClient.getToken();
  }
}