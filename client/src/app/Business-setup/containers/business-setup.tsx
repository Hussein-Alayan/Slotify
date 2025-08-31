"use client";

import { useBusinessSetup, setupSteps, daysOfWeek } from "./useBusinessSetup";
import { Card, CardContent } from "@/components/ui/card";
import { SetupSidebar } from "../Components/SetupSidebar";
import { SetupProgress } from "../Components/SetupProgress";
import { SetupNavigation } from "../Components/SetupNavigation";
import { BusinessProfileForm } from "../Components/BusinessProfileForm";
import { ServicesForm } from "../Components/ServicesForm";
import { StaffForm } from "../Components/StaffForm";
import { BookingRulesForm } from "../Components/BookingRulesForm";
import { CommunicationSettingsForm } from "../Components/CommunicationSettingsForm";

export default function BusinessSetupContainer() {
  const {
    currentStep,
    setCurrentStep,
    businessData,
    workingHours,
    services,
    staff,
    bookingRules,
    communicationSettings,
    handleInputChange,
    handleWorkingHoursChange,
    addService,
    removeService,
    updateService,
    addStaff,
    removeStaff,
    updateStaff,
    setBookingRules,
    setCommunicationSettings,
    prevStep,
    nextStep,
  } = useBusinessSetup();

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
