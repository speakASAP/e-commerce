/**
 * Products API
 */

import { apiClient } from './client';

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  stockQuantity: number;
  brand?: string;
  images?: string[];
  categories?: Category[];
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  attributes?: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const productsApi = {
  async getProducts(filters?: ProductFilters) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString();
    return apiClient.get<PaginatedResponse<Product>>(
      `/products${query ? `?${query}` : ''}`
    );
  },

  async getProduct(id: string) {
    return apiClient.get<Product>(`/products/${id}`);
  },

  async getCategories() {
    return apiClient.get<Category[]>('/categories');
  },

  async getCategory(id: string) {
    return apiClient.get<Category>(`/categories/${id}`);
  },
};

