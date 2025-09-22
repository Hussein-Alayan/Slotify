import api from "@/lib/api";
import { ApiResponse } from './types';

export async function fetchUserBusinesses() {
  const response = await api.get<ApiResponse<unknown>>("/v1/businesses");
  return response.data.data;
}

export async function fetchBusinessDetails(businessId: number) {
  const response = await api.get<ApiResponse<unknown>>(`/v1/businesses/${businessId}`);
  return response.data.data;
}
