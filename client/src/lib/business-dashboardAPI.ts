type TotalBookingsResponse = { total_bookings: number };

// Fetch total bookings for a business
export async function getTotalBookings(businessId: string | number) {
	const res = await api.get<TotalBookingsResponse>(`/v1/businesses/${businessId}/total-bookings`);
	return res.data.total_bookings;
}
import api from "./api";

type TotalClientsResponse = { total_clients: number };

// Fetch total clients for a business
export async function getTotalClients(businessId: string | number) {
	const res = await api.get<TotalClientsResponse>(`/v1/businesses/${businessId}/total-clients`);
	return res.data.total_clients;
}
