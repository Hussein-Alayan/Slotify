import api from "@/lib/api"; // your preconfigured axios/fetch wrapper

// Generic API envelope returned by your backend
interface ApiResponse<T> {
  data: T;
  success: boolean;
}

// Service attached to a staff member
export interface Service {
  id: number;
  name: string;
  duration_minutes: number;
  price: string;
  description: string;
  status: string;
  photo_url?: string;
}

// Staff model (shape returned by the API)
export interface Staff {
  id: number;
  business_id: number;
  name: string;
  role: string | null;
  special_skills: string | null;
  // Availability on the server includes start,end and closed flag
  availability: Record<
    string,
    {
      start: string; // "HH:MM"
      end: string; // "HH:MM"
      closed: boolean;
    }
  >;
  type: string;
  created_at: string;
  updated_at: string;
  services?: Service[];
  // Absence tracking fields
  is_absent: boolean;
  absence_reason: string | null;
  absence_start: string | null;
  absence_end: string | null;
}

export async function getStaff(businessId: number): Promise<Staff[]> {
  const response = await api.get<ApiResponse<Staff[]>>(
    `/v1/businesses/${businessId}/resources?type=staff`
  );
  return response.data.data;
}

export async function updateStaff(
  businessId: number,
  staffId: number,
  data: Partial<CreateStaffPayload>
): Promise<Staff> {
  // Map client availability to server format if provided
  const payload: Record<string, unknown> = { ...data };
  if (data.availability) {
    const mappedAvailability: Staff["availability"] = Object.entries(
      data.availability
    ).reduce((acc, [day, [start, end]]) => {
      acc[day] = { start, end, closed: false };
      return acc;
    }, {} as Staff["availability"]);
    payload.availability = mappedAvailability;
  }

  const response = await api.patch<ApiResponse<Staff>>(
    `/v1/businesses/${businessId}/resources/${staffId}`,
    payload
  );
  return response.data.data;
}


export type CreateStaffPayload = {
  name: string;
  role: string;
  special_skills: string;
  availability: Record<string, [string, string]>;
  type?: string;
};

export async function createStaff(
  businessId: number,
  data: CreateStaffPayload
): Promise<Staff> {
  // Map client availability ([start,end]) to server shape ({start,end,closed})
  const mappedAvailability: Staff["availability"] = Object.entries(
    data.availability || {}
  ).reduce((acc, [day, [start, end]]) => {
    acc[day] = {
      start,
      end,
      closed: false, // default to open if provided on client
    };
    return acc;
  }, {} as Staff["availability"]);

  const payload = {
    ...data,
    type: data.type || "staff",
    availability: mappedAvailability,
  };

  const response = await api.post<ApiResponse<Staff>>(
    `/v1/businesses/${businessId}/resources`,
    payload
  );

  return response.data.data;
}

export async function deleteStaff(
  businessId: number,
  staffId: number
): Promise<{ success: boolean; message: string }> {
  const response = await api.delete<
    ApiResponse<{ success: boolean; message: string }>
  >(`/v1/businesses/${businessId}/resources/${staffId}`);
  return response.data.data;
}

// Absence management functions
export interface AbsenceData {
  reason: string;
  start_date: string;
  end_date: string;
}

export interface Booking {
  id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  service?: {
    id: number;
    name: string;
  };
  client?: {
    id: number;
    name: string;
  };
}

export interface AbsenceResult {
  staff: Staff;
  affected_bookings_count: number;
  successfully_reassigned: Array<{ booking: Booking; new_staff: Staff }>;
  failed_reassignments: Array<{ booking: Booking; error: string }>;
  conflicts: Array<{ booking: Booking; reason: string }>;
}

export interface AbsenceImpact {
  staff_name: string;
  absence_period: {
    start: string;
    end: string;
  };
  total_affected_bookings: number;
  services_affected: string[];
  clients_affected: string[];
  bookings_by_date: Record<string, number>;
}

export async function markStaffAbsent(
  businessId: number,
  staffId: number,
  absenceData: AbsenceData
): Promise<AbsenceResult> {
  const response = await api.post<ApiResponse<AbsenceResult>>(
    `/v1/businesses/${businessId}/resources/${staffId}/absent`,
    absenceData
  );
  return response.data.data;
}

export async function markStaffPresent(
  businessId: number,
  staffId: number
): Promise<{ message: string; staff: Staff }> {
  const response = await api.post<ApiResponse<{ message: string; staff: Staff }>>(
    `/v1/businesses/${businessId}/resources/${staffId}/present`
  );
  return response.data.data;
}

export async function getAbsenceImpact(
  businessId: number,
  staffId: number,
  startDate?: string,
  endDate?: string
): Promise<AbsenceImpact> {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  const response = await api.get<ApiResponse<AbsenceImpact>>(
    `/v1/businesses/${businessId}/resources/${staffId}/absence-impact?${params}`
  );
  return response.data.data;
}

export async function getAbsentStaff(businessId: number): Promise<Staff[]> {
  const response = await api.get<ApiResponse<Staff[]>>(
    `/v1/businesses/${businessId}/absent-staff`
  );
  return response.data.data;
}
