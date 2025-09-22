import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SetupNavigationProps {
  currentStep: number;
  totalSteps: number;
  prevStep: () => void;
  nextStep: () => void;
}

export function SetupNavigation({
  currentStep,
  totalSteps,
  prevStep,
  nextStep,
}: SetupNavigationProps) {
  return (
    <div className="flex items-center justify-between mt-6">
      <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      {currentStep !== totalSteps && (
        <Button onClick={nextStep} className="bg-slate-900 hover:bg-slate-800">
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
