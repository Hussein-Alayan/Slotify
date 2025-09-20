import api from './api';

interface ApiResponse<T> {
  data: T;
  success: boolean;
}

export interface Booking {
  id: number;
  business_id: number;
  client_id: number;
  service_id: number;
  resource_id: number;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
  updated_at: string;
  source: string;
  cancellation_reason?: string | null;
  cancelled_at?: string | null;
}

export interface Client {
  id: number;
  business_id: number;
  name: string;
  phone: string;
  email?: string;
  whatsapp_opted_in: boolean;
  normalized_phone: string;
  created_at: string;
  updated_at: string;
  bookings: Booking[];
}

export async function createClient(businessId: number, data: {
  name: string;
  phone: string;
  email?: string;
  whatsapp_opted_in?: boolean;
}) {
  const response = await api.post<ApiResponse<Client>>(`/v1/businesses/${businessId}/clients`, data);
  return response.data.data;
}

export async function fetchClients(businessId: number) {
  const response = await api.get<ApiResponse<Client[]>>(`/v1/businesses/${businessId}/clients`);
  return response.data.data;
}

export async function updateClient(businessId: number, clientId: number, data: {
  name?: string;
  phone?: string;
  email?: string;
  whatsapp_opted_in?: boolean;
}) {
  const response = await api.put<ApiResponse<Client>>(`/v1/businesses/${businessId}/clients/${clientId}`, data);
  return response.data.data;
}

export async function deleteClient(businessId: number, clientId: number) {
  const response = await api.delete<ApiResponse<{ message: string }>>(`/v1/businesses/${businessId}/clients/${clientId}`);
  return response.data.data;
}
