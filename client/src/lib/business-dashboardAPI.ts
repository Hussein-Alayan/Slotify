import api from "./api";

type TotalClientsResponse = { total_clients: number };

// Fetch total clients for a business
export async function getTotalClients(businessId: string | number) {
	const res = await api.get<TotalClientsResponse>(`/v1/businesses/${businessId}/total-clients`);
	return res.data.total_clients;
}
