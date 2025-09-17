type TotalServicesResponse = { total_services: number };
type ActiveServicesResponse = { active_services: number };

// Fetch total services for a business
export async function getTotalServices(businessId: string | number) {
	const res = await api.get<TotalServicesResponse>(`/v1/businesses/${businessId}/total-services`);
	return res.data.total_services;
}

// Fetch active services for a business
export async function getActiveServices(businessId: string | number) {
	const res = await api.get<ActiveServicesResponse>(`/v1/businesses/${businessId}/active-services`);
	return res.data.active_services;
}
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
