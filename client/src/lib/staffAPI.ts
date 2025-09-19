
import api from "@/lib/api";

interface ApiResponse<T> {
	data: T;
	success: boolean;
}

export interface Staff {
	id: number;
	business_id: number;
	name: string;
	role: string;
	special_skills: string;
	availability: Record<string, [string, string]>;
	type: string;
	created_at: string;
	updated_at: string;
}

export async function createStaff(businessId: number, data: {
	name: string;
	role: string;
	special_skills: string;
	availability: Record<string, [string, string]>;
	type?: string;
}) {
	const response = await api.post<ApiResponse<Staff>>(`/v1/businesses/${businessId}/resources`, {
		...data,
		type: data.type || "staff",
	});
	return response.data.data;
}
