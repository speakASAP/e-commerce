/**
 * Cart API
 */

import { apiClient } from './client';
import { Product, ProductVariant } from './products';

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface AddToCartData {
  productId: string;
  variantId?: string;
  quantity: number;
}

export const cartApi = {
  async getCart() {
    return apiClient.get<Cart>('/cart');
  },

  async addToCart(data: AddToCartData) {
    return apiClient.post<CartItem>('/cart/items', data);
  },

  async updateCartItem(id: string, quantity: number) {
    return apiClient.put<CartItem>(`/cart/items/${id}`, { quantity });
  },

  async removeFromCart(id: string) {
    return apiClient.delete(`/cart/items/${id}`);
  },

  async clearCart() {
    return apiClient.delete('/cart');
  },
};

