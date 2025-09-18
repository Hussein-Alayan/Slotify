import api from "./api";

// Type definitions
type TotalServicesResponse = { success: boolean; data: { total_services: number } };
type ActiveServicesResponse = { success: boolean; data: { active_services: number } };
type TotalBookingsResponse = { total_bookings: number };
type TotalClientsResponse = { total_clients: number };

// Fetch total services for a business
export async function getTotalServices(businessId: string | number) {
	const res = await api.get<TotalServicesResponse>(`/v1/businesses/${businessId}/total-services`);
	return res.data.data.total_services;
}

// Fetch active services for a business
export async function getActiveServices(businessId: string | number) {
	const res = await api.get<ActiveServicesResponse>(`/v1/businesses/${businessId}/active-services`);
	return res.data.data.active_services;
}

// Fetch total bookings for a business
export async function getTotalBookings(businessId: string | number) {
	const res = await api.get<TotalBookingsResponse>(`/v1/businesses/${businessId}/total-bookings`);
	return res.data.total_bookings;
}

// Fetch total clients for a business
export async function getTotalClients(businessId: string | number) {
	const res = await api.get<TotalClientsResponse>(`/v1/businesses/${businessId}/total-clients`);
	return res.data.total_clients;
}

// Unified function to get all business stats
export async function getBusinessStats(businessId: string | number) {
	const [totalClients, totalBookings, totalServices, activeServices] = await Promise.all([
		getTotalClients(businessId),
		getTotalBookings(businessId),
		getTotalServices(businessId),
		getActiveServices(businessId),
	]);
	
	return {
		totalClients,
		totalBookings,
		totalServices,
		activeServices,
	};
}
