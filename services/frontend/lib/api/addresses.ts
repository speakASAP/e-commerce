/**
 * Delivery Addresses API
 */

import { apiClient } from './client';

export interface DeliveryAddress {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export const addressesApi = {
  async getAddresses() {
    return apiClient.get<DeliveryAddress[]>('/delivery-addresses');
  },

  async createAddress(data: CreateAddressData) {
    return apiClient.post<DeliveryAddress>('/delivery-addresses', data);
  },

  async updateAddress(id: string, data: Partial<CreateAddressData>) {
    return apiClient.put<DeliveryAddress>(`/delivery-addresses/${id}`, data);
  },

  async deleteAddress(id: string) {
    return apiClient.delete(`/delivery-addresses/${id}`);
  },
};
