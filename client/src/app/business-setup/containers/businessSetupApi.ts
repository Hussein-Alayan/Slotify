import api from '@/lib/api';
import type { BusinessData, WorkingHours } from '../components/BusinessProfileForm';
import type { Service } from '../components/ServicesForm';
import type { StaffMember } from '../components/StaffForm';

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
  // Transform working hours from object format to array format for backend
  const transformedWorkingHours: { [key: string]: string[] } = {};
  Object.keys(workingHours).forEach(day => {
    const dayData = workingHours[day];
    if (dayData.closed) {
      transformedWorkingHours[day] = [];
    } else {
      transformedWorkingHours[day] = [dayData.start, dayData.end];
    }
  });

  return {
    name: businessData.businessName,
    industry: businessData.industry,
    contact_email: businessData.contactEmail,
    contact_phone: businessData.contactPhone,
    address: businessData.businessAddress,
    brand_voice: businessData.brandVoice,
    working_hours: transformedWorkingHours,
    services: services
      .filter(s => s.name && s.name.trim() && s.duration && s.price)
      .map(s => ({
        name: s.name,
        duration_minutes: s.duration,
        price: s.price,
        description: s.description,
      })),
    resources: staff
      .filter(st => st.name && st.name.trim())
      .map(st => ({
        type: 'staff',
        name: st.name,
        role: st.role,
        specialSkills: st.specialSkills,
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
