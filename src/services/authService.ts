import { apiClient } from './api';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
}

export class AuthService {
  static async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber?: string
  ): Promise<AuthResponse> {
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

  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    apiClient.setToken(response.token);
    return response;
  }

  static async getProfile() {
    return apiClient.get('/auth/profile');
  }

  static async updateProfile(data: any) {
    return apiClient.put('/auth/profile', data);
  }

  static logout() {
    apiClient.clearToken();
  }

  static isAuthenticated(): boolean {
    return !!apiClient.getToken();
  }
}
