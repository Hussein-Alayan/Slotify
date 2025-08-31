import { useState } from "react";
import type {
  BusinessData,
  WorkingHour,
  WorkingHours,
  DayOfWeek,
} from "../Components/BusinessProfileForm";
import type { Service } from "../Components/ServicesForm";
import type { StaffMember } from "../Components/StaffForm";
import type { BookingRules } from "../Components/BookingRulesForm";
import type { CommunicationSettings } from "../Components/CommunicationSettingsForm";
import { User, Plus, Users, Settings, MessageCircle } from "lucide-react";

export const setupSteps = [
  { id: 1, name: "Business Profile", icon: User, description: "Business Info" },
  { id: 2, name: "Services", icon: Plus, description: "Add Services" },
  { id: 3, name: "Staff", icon: Users, description: "Add Staff" },
  {
    id: 4,
    name: "Booking Rules",
    icon: Settings,
    description: "Booking Rules",
  },
  {
    id: 5,
    name: "Communication",
    icon: MessageCircle,
    description: "Communication",
  },
];

export const defaultBusinessData: BusinessData = {
  businessName: "",
  industry: "",
  contactEmail: "",
  contactPhone: "",
  businessAddress: "",
  brandVoice: "",
  timezone: "",
};

export const defaultWorkingHours: WorkingHours = {
  mon: { start: "09:00", end: "17:00", closed: false },
  tue: { start: "09:00", end: "17:00", closed: false },
  wed: { start: "09:00", end: "17:00", closed: false },
  thu: { start: "09:00", end: "17:00", closed: false },
  fri: { start: "09:00", end: "17:00", closed: false },
  sat: { start: "09:00", end: "17:00", closed: true },
  sun: { start: "09:00", end: "17:00", closed: true },
};

export const daysOfWeek: DayOfWeek[] = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

export const defaultBookingRules: BookingRules = {
  leadTime: 24,
  cancellationPolicy: 24,
  bufferTime: 0,
  maxBookingsPerClient: 1,
};

export const defaultCommunicationSettings: CommunicationSettings = {
  whatsappApiKey: "",
  autoReplyEnabled: false,
  responseStyle: "friendly",
  notifications: {
    newBooking: true,
    cancellation: true,
    reschedule: true,
    reminder: true,
  },
};

export function useBusinessSetup() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [businessData, setBusinessData] = useState<BusinessData>({
    ...defaultBusinessData,
  });
  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    ...defaultWorkingHours,
  });
  const [services, setServices] = useState<Service[]>([
    {
      id: Date.now(),
      name: "",
      description: "",
      duration: 30,
      price: 0,
      maxClients: 1,
      specialRules: "",
    },
  ]);
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: Date.now().toString(),
      name: "",
      role: "",
      specialSkills: "",
      maxAppointments: 10,
      availability: { ...defaultWorkingHours },
    },
  ]);
  const [bookingRules, setBookingRules] = useState<BookingRules>({
    ...defaultBookingRules,
  });
  const [communicationSettings, setCommunicationSettings] =
    useState<CommunicationSettings>({ ...defaultCommunicationSettings });

  // Handlers
  const handleInputChange = (field: keyof BusinessData, value: string) => {
    setBusinessData((prev: BusinessData) => ({ ...prev, [field]: value }));
  };

  const handleWorkingHoursChange = (
    dayKey: string,
    field: keyof WorkingHour,
    value: string | boolean
  ) => {
    setWorkingHours((prev: WorkingHours) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value,
      },
    }));
  };

  // Services handlers
  const addService = () => {
    setServices((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        description: "",
        duration: 30,
        price: 0,
        maxClients: 1,
        specialRules: "",
      },
    ]);
  };
  const removeService = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };
  const updateService = (id: number, field: string, value: string | number) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Staff handlers
  const addStaff = () => {
    setStaff((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        role: "",
        specialSkills: "",
        maxAppointments: 10,
        availability: { ...defaultWorkingHours },
      },
    ]);
  };
  const removeStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };
  const updateStaff = (
    id: string,
    field: string,
    value: string | number | StaffMember["availability"]
  ) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Navigation
  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1));
  const nextStep = () =>
    setCurrentStep((s) => Math.min(setupSteps.length, s + 1));

  return {
    currentStep,
    setCurrentStep,
    businessData,
    setBusinessData,
    workingHours,
    setWorkingHours,
    services,
    setServices,
    staff,
    setStaff,
    bookingRules,
    setBookingRules,
    communicationSettings,
    setCommunicationSettings,
    handleInputChange,
    handleWorkingHoursChange,
    addService,
    removeService,
    updateService,
    addStaff,
    removeStaff,
    updateStaff,
    prevStep,
    nextStep,
  };
}
