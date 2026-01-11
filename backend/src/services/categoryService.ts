import Category, { ICategory } from '../models/Category.js';

export class CategoryService {
  static async getAllCategories() {
    try {
      const categories = await Category.find();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  static async getCategoryById(categoryId: string) {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      throw error;
    }
  }

  static async createCategory(categoryData: Partial<ICategory>) {
    try {
      const category = new Category(categoryData);
      await category.save();
      return category;
    } catch (error) {
      throw error;
    }
  }

  static async updateCategory(categoryId: string, updateData: Partial<ICategory>) {
    try {
      const category = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      throw error;
    }
  }

  static async deleteCategory(categoryId: string) {
    try {
      const category = await Category.findByIdAndDelete(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      throw error;
    }
  }
}
