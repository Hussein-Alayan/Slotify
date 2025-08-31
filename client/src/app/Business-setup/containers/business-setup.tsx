"use client";

import { useState } from "react";
// Types from presentational components
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
import { Card, CardContent } from "@/components/ui/card";
import { SetupSidebar } from "../Components/SetupSidebar";
import { SetupProgress } from "../Components/SetupProgress";
import { SetupNavigation } from "../Components/SetupNavigation";
import { BusinessProfileForm } from "../Components/BusinessProfileForm";
import { ServicesForm } from "../Components/ServicesForm";
import { StaffForm } from "../Components/StaffForm";
import { BookingRulesForm } from "../Components/BookingRulesForm";
import { CommunicationSettingsForm } from "../Components/CommunicationSettingsForm";

import { User, Plus, Users, Settings, MessageCircle } from "lucide-react";

// Stepper steps definition
const setupSteps = [
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

const defaultBusinessData: BusinessData = {
  businessName: "",
  industry: "",
  contactEmail: "",
  contactPhone: "",
  businessAddress: "",
  brandVoice: "",
  timezone: "",
};

const defaultWorkingHours: WorkingHours = {
  mon: { start: "09:00", end: "17:00", closed: false },
  tue: { start: "09:00", end: "17:00", closed: false },
  wed: { start: "09:00", end: "17:00", closed: false },
  thu: { start: "09:00", end: "17:00", closed: false },
  fri: { start: "09:00", end: "17:00", closed: false },
  sat: { start: "09:00", end: "17:00", closed: true },
  sun: { start: "09:00", end: "17:00", closed: true },
};

const daysOfWeek: DayOfWeek[] = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

const defaultBookingRules: BookingRules = {
  leadTime: 24,
  cancellationPolicy: 24,
  bufferTime: 0,
  maxBookingsPerClient: 1,
};

const defaultCommunicationSettings: CommunicationSettings = {
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

export default function BusinessSetupContainer() {
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

  return (
    <div className="min-h-screen bg-slate-900">
      <SetupProgress setupSteps={setupSteps} currentStep={currentStep} />
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SetupSidebar
              setupSteps={setupSteps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                {currentStep === 1 && (
                  <BusinessProfileForm
                    businessData={businessData}
                    workingHours={workingHours}
                    daysOfWeek={daysOfWeek}
                    handleInputChange={handleInputChange}
                    handleWorkingHoursChange={handleWorkingHoursChange}
                  />
                )}
                {currentStep === 2 && (
                  <ServicesForm
                    services={services}
                    addService={addService}
                    removeService={removeService}
                    updateService={updateService}
                  />
                )}
                {currentStep === 3 && (
                  <StaffForm
                    staff={staff}
                    daysOfWeek={daysOfWeek}
                    addStaff={addStaff}
                    removeStaff={removeStaff}
                    updateStaff={updateStaff}
                  />
                )}
                {currentStep === 4 && (
                  <BookingRulesForm
                    bookingRules={bookingRules}
                    setBookingRules={setBookingRules}
                  />
                )}
                {currentStep === 5 && (
                  <CommunicationSettingsForm
                    communicationSettings={communicationSettings}
                    setCommunicationSettings={setCommunicationSettings}
                  />
                )}
              </CardContent>
            </Card>
            <SetupNavigation
              currentStep={currentStep}
              totalSteps={setupSteps.length}
              prevStep={prevStep}
              nextStep={nextStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
