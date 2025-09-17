import api from './api';

export async function createService(businessId: number, data: {
  name: string;
  duration_minutes: number;
  price: number;
  description?: string;
  status: 'active' | 'inactive';
}) {
  const response = await api.post(`/businesses/${businessId}/services`, data);
  return response.data;
}
