import api from '@/lib/api';
import type { BusinessData, WorkingHours } from '../Components/BusinessProfileForm';
import type { Service } from '../Components/ServicesForm';
import type { StaffMember } from '../Components/StaffForm';

// Map frontend state to backend payload
function mapBusinessSetupToPayload({
  businessData,
  workingHours,
  services,
  staff,
}: {
  businessData: BusinessData;
  workingHours: WorkingHours;
  services: Service[];
  staff: StaffMember[];
}) {
  return {
    name: businessData.businessName,
    industry: businessData.industry,
    contact_email: businessData.contactEmail,
    contact_phone: businessData.contactPhone,
    address: businessData.businessAddress,
    brand_voice: businessData.brandVoice,
    working_hours: workingHours,
    services: services.map(s => ({
      name: s.name,
      duration_minutes: s.duration,
      price: s.price,
      description: s.description,
    })),
    resources: staff.map(st => ({
      type: 'staff',
      name: st.name,
      availability: st.availability,
    })),
  };
}

// API call to save business profile
export async function saveBusinessProfile({
  businessData,
  workingHours,
  services,
  staff,
}: {
  businessData: BusinessData;
  workingHours: WorkingHours;
  services: Service[];
  staff: StaffMember[];
}) {
  const payload = mapBusinessSetupToPayload({ businessData, workingHours, services, staff });
  const response = await api.post('/v1/business-profile', payload);
  return response.data;
}
