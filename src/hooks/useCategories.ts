import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CategoryService } from '../services/categoryService';

// Query keys
export const categoryKeys = {
  all: ['categories'],
  lists: () => ['categories', 'list'],
  list: () => ['categories', 'list'],
  details: () => ['categories', 'detail'],
  detail: (id) => ['categories', 'detail', id],
};

// Fetch all categories
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => CategoryService.getAllCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutes - categories don't change often
  });
}

// Fetch single category
export function useCategory(categoryId) {
  return useQuery({
    queryKey: categoryKeys.detail(categoryId),
    queryFn: () => CategoryService.getCategoryById(categoryId),
    enabled: !!categoryId,
  });
}

// Create category
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => CategoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });
}

// Update category
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => CategoryService.updateCategory(params.categoryId, params.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(data._id) });
    },
  });
}

// Delete category
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId) => CategoryService.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });
}