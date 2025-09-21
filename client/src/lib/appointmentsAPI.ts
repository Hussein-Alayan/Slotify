
import api from './api';
import { ApiResponse } from './types';


export interface Appointment {
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
  client: {
    id: number;
    name: string;
    email: string | null;
    phone: string;
  };
  service: {
    id: number;
    name: string;
    duration: string | null;
    price: string;
  };
  resource: {
    id: number;
    name: string | null;
    type: string | null;
  };
}

// Fetch appointments for a business by date (optionally pass date params)
export async function fetchAppointments(
  businessId: number,
  params?: { date?: string }
): Promise<Appointment[]> {
  const response = await api.get<ApiResponse<Appointment[]>>(
    `/v1/businesses/${businessId}/bookings/by-date`,
    { params }
  );
  return response.data.data;
}

// Fetch all appointments for a business (no date filtering)
export async function fetchAllAppointments(businessId: number): Promise<Appointment[]> {
  const response = await api.get<ApiResponse<Appointment[]>>(
    `/v1/businesses/${businessId}/bookings`
  );
  return response.data.data;
}