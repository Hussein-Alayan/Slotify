import React from "react";
import { cn } from "@/lib/utils";

export interface SetupStep {
  id: number;
  name: string;
  icon: React.ElementType;
  description: string;
}

interface SetupProgressProps {
  setupSteps: SetupStep[];
  currentStep: number;
}

export function SetupProgress({ setupSteps, currentStep }: SetupProgressProps) {
  return (
    <div className="bg-white px-6 py-4 border-b">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Setup Progress</h2>
          <span className="text-sm text-gray-600">
            Step {currentStep} of {setupSteps.length}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {setupSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep === step.id
                    ? "bg-slate-900 text-white"
                    : currentStep > step.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                )}
              >
                {step.id}
              </div>
              <span
                className={cn(
                  "ml-2 text-sm font-medium",
                  currentStep === step.id ? "text-slate-900" : "text-gray-600"
                )}
              >
                {step.name}
              </span>
              {index < setupSteps.length - 1 && (
                <div className="w-8 h-px bg-gray-300 mx-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
