"use client";

import { useBusinessSetup, setupSteps, daysOfWeek } from "./useBusinessSetup";
import { saveBusinessProfile } from "./businessSetupApi";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SetupSidebar } from "../components/SetupSidebar";
import { SetupProgress } from "../components/SetupProgress";
import { SetupNavigation } from "../components/SetupNavigation";
import { BusinessProfileForm } from "../components/BusinessProfileForm";
import { ServicesForm } from "../components/ServicesForm";
import { StaffForm } from "../components/StaffForm";
import { BookingRulesForm } from "../components/BookingRulesForm";
import { CommunicationSettingsForm } from "../components/CommunicationSettingsForm";

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await saveBusinessProfile({
        businessData,
        workingHours,
        services,
        staff,
      });
      setSuccess(true);
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null) {
        const err = e as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to save business profile"
        );
      } else {
        setError("Failed to save business profile");
      }
    } finally {
      setLoading(false);
    }
  }

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
                {/* Show Save/Finish button on last step */}
                {currentStep === setupSteps.length && (
                  <div className="mt-6 flex flex-col gap-2">
                    <button
                      className="bg-primary text-white px-6 py-2 rounded disabled:opacity-50"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Finish Setup"}
                    </button>
                    {error && <div className="text-red-500">{error}</div>}
                    {success && (
                      <div className="text-green-600">
                        Business profile saved!
                      </div>
                    )}
                  </div>
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
