// Mock utilities for API testing

// Mock response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface MockAxiosResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: Record<string, unknown>;
}

// Define specific response types
interface LoginData {
  user: {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
  token: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface BusinessData {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  description?: string;
  industry?: string;
  status?: string;
  bookingRules?: Record<string, unknown>;
  services?: unknown[];
  resources?: unknown[];
}

interface ServiceData {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  status: 'active' | 'inactive';
}

interface StatsData {
  total_services?: number;
  active_services?: number;
  total_bookings?: number;
  total_clients?: number;
  business_id: number;
}

// Authentication mock responses
export const mockAuthResponses = {
  loginSuccess: {
    data: {
      success: true,
      data: {
        user: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          created_at: "2024-01-01T00:00:00.000000Z",
          updated_at: "2024-01-01T00:00:00.000000Z"
        },
        token: "mock-auth-token-123"
      }
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  } as MockAxiosResponse<ApiResponse<LoginData>>,

  registerSuccess: {
    data: {
      success: true,
      data: {
        user: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          created_at: "2024-01-01T00:00:00.000000Z",
          updated_at: "2024-01-01T00:00:00.000000Z"
        },
        token: "mock-auth-token-123"
      }
    },
    status: 201,
    statusText: 'Created',
    headers: {},
    config: {}
  } as MockAxiosResponse<ApiResponse<LoginData>>,

  meSuccess: {
    data: {
      success: true,
      data: {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        created_at: "2024-01-01T00:00:00.000000Z",
        updated_at: "2024-01-01T00:00:00.000000Z"
      }
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  } as MockAxiosResponse<ApiResponse<UserData>>,

  loginError: {
    response: {
      status: 422,
      data: {
        success: false,
        message: "Invalid credentials"
      }
    }
  },

  unauthorizedError: {
    response: {
      status: 401,
      data: {
        success: false,
        message: "Unauthenticated"
      }
    }
  }
};

// Business setup mock responses
export const mockBusinessResponses = {
  saveProfileSuccess: {
    data: {
      success: true,
      data: {
        id: 1,
        name: "Test Business",
        address: "123 Main St",
        phone: "+1234567890",
        description: "Test business description"
      }
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  } as MockAxiosResponse<ApiResponse<BusinessData>>,

  fetchBusinessesSuccess: {
    data: {
      success: true,
      data: [
        {
          id: 1,
          name: "Elite Barbershop",
          industry: "Beauty & Wellness",
          status: "Active"
        },
        {
          id: 2,
          name: "Tech Consulting",
          industry: "Professional Services",
          status: "Active"
        }
      ]
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  } as MockAxiosResponse<ApiResponse<BusinessData[]>>,

  businessDetailsSuccess: {
    data: {
      success: true,
      data: {
        id: 1,
        name: "Elite Barbershop",
        address: "123 Main St",
        phone: "+1234567890",
        description: "Best barbers in town",
        bookingRules: {},
        services: [],
        resources: []
      }
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  } as MockAxiosResponse<ApiResponse<BusinessData>>
};

// Services mock responses
export const mockServicesResponses = {
  fetchServicesSuccess: {
    data: {
      success: true,
      data: [
        {
          id: 1,
          name: "Haircut",
          description: "Professional haircut service",
          price: 25.00,
          duration_minutes: 30,
          status: "active" as const
        },
        {
          id: 2,
          name: "Beard Trim",
          description: "Professional beard trimming",
          price: 15.00,
          duration_minutes: 15,
          status: "active" as const
        }
      ]
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  } as MockAxiosResponse<ApiResponse<ServiceData[]>>,

  createServiceSuccess: {
    data: {
      success: true,
      data: {
        id: 3,
        name: "Hair Wash",
        description: "Hair washing service",
        price: 10.00,
        duration_minutes: 15,
        status: "active" as const
      }
    },
    status: 201,
    statusText: 'Created',
    headers: {},
    config: {}
  } as MockAxiosResponse<ApiResponse<ServiceData>>,

  updateServiceSuccess: {
    data: {
      success: true,
      data: {
        id: 1,
        name: "Premium Haircut",
        description: "Premium haircut service",
        price: 35.00,
        duration_minutes: 45,
        status: "active" as const
      }
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  } as MockAxiosResponse<ApiResponse<ServiceData>>
};

// Business dashboard stats mock responses
export const mockDashboardResponses = {
  totalServicesSuccess: {
    data: {
      success: true,
      data: {
        total_services: 15,
        business_id: 1
      }
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  } as MockAxiosResponse<ApiResponse<StatsData>>,

  activeServicesSuccess: {
    data: {
      success: true,
      data: {
        active_services: 12,
        business_id: 1
      }
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  } as MockAxiosResponse<ApiResponse<StatsData>>,

  totalBookingsSuccess: {
    data: {
      success: true,
      data: {
        total_bookings: 450,
        business_id: 1
      }
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  } as MockAxiosResponse<ApiResponse<StatsData>>,

  totalClientsSuccess: {
    data: {
      success: true,
      data: {
        total_clients: 120,
        business_id: 1
      }
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  } as MockAxiosResponse<ApiResponse<StatsData>>
};

// Network error mock
export const mockNetworkError = {
  code: 'NETWORK_ERROR',
  message: 'Network Error',
  isAxiosError: true
};

// Helper to create mock API responses
export const createMockApiResponse = <T>(data: T, success = true): MockAxiosResponse<ApiResponse<T>> => ({
  data: {
    success,
    data
  },
  status: success ? 200 : 400,
  statusText: success ? 'OK' : 'Bad Request',
  headers: {},
  config: {}
});

// Helper to create mock API error
export const createMockApiError = (status: number, message: string) => ({
  response: {
    status,
    data: {
      success: false,
      message
    }
  }
});