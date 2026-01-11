import { apiClient } from './api';

export interface CategoryResponse {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export class CategoryService {
  static async getAllCategories(): Promise<CategoryResponse[]> {
    return apiClient.get('/categories');
  }

  static async getCategoryById(categoryId: string): Promise<CategoryResponse> {
    return apiClient.get(`/categories/${categoryId}`);
  }

  static async createCategory(data: Partial<CategoryResponse>): Promise<CategoryResponse> {
    return apiClient.post('/categories', data);
  }

  static async updateCategory(categoryId: string, data: Partial<CategoryResponse>): Promise<CategoryResponse> {
    return apiClient.put(`/categories/${categoryId}`, data);
  }

  static async deleteCategory(categoryId: string): Promise<void> {
    return apiClient.delete(`/categories/${categoryId}`);
  }
}
