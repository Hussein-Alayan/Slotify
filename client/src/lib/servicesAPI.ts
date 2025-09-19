import api from './api';

interface ApiResponse<T> {
  data: T;
  success: boolean;
}

export async function updateService(businessId: number, serviceId: number, data: {
  name?: string;
  duration_minutes?: number;
  price?: number;
  description?: string;
  status?: 'active' | 'inactive';
}) {
  const response = await api.patch(`/v1/businesses/${businessId}/services/${serviceId}`, data);
  return response.data;
}

export async function fetchServices(businessId: number) {
  const response = await api.get(`/v1/businesses/${businessId}/services`);
  return response.data;
}

export async function createService(businessId: number, data: {
  name: string;
  duration_minutes: number;
  price: number;
  description?: string;
  status: 'active' | 'inactive';
}) {
  const response = await api.post<ApiResponse<unknown>>(`/v1/businesses/${businessId}/services`, data);
  return response.data.data;
}
