import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchServices as getServicesAPI, createService, updateService } from '@/lib/servicesAPI';
import api from '@/lib/api';

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

interface ServicesState {
  items: Service[];
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (businessId: number) => {
  const response = await getServicesAPI(businessId) as Service[] | { data?: Service[]; services?: Service[] };
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.services)) return response.services;
  return [];
  }
);

export const addService = createAsyncThunk(
  'services/addService',
  async ({ businessId, serviceData }: { businessId: number; serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'> }) => {
    const response = await createService(businessId, serviceData);
    return response as Service;
  }
);

export const editService = createAsyncThunk(
  'services/editService',
  async ({ businessId, serviceId, serviceData }: { businessId: number; serviceId: number; serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'> }) => {
    const response = await updateService(businessId, serviceId, serviceData);
    return response as Service;
  }
);

export const removeService = createAsyncThunk(
  'services/removeService',
  async ({ businessId, serviceId }: { businessId: number; serviceId: number }) => {
    await api.delete(`/v1/businesses/${businessId}/services/${serviceId}`);
    return serviceId;
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch services';
      })
      // Add service
      .addCase(addService.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addService.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add service';
      })
      // Edit service
      .addCase(editService.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(editService.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update service';
      })
      // Remove service
      .addCase(removeService.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(removeService.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete service';
      });
  },
});

export const { clearError } = servicesSlice.actions;
export default servicesSlice.reducer;
