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
}

export async function getStaff(businessId: number): Promise<Staff[]> {
  const response = await api.get<ApiResponse<Staff[]>>(
    `/v1/businesses/${businessId}/resources?type=staff`
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
