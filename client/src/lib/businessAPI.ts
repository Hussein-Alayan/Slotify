import api from "@/lib/api";

export async function fetchUserBusinesses() {
  const response = await api.get("/v1/businesses");
  return response.data.data;
}

export async function fetchBusinessDetails(businessId: number) {
  const response = await api.get(`/v1/businesses/${businessId}`);
  return response.data.data;
}
