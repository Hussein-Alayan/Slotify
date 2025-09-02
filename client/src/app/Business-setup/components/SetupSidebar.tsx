import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

export interface SetupStep {
  id: number;
  name: string;
  icon: React.ElementType;
  description: string;
}

interface SetupSidebarProps {
  setupSteps: SetupStep[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export function SetupSidebar({
  setupSteps,
  currentStep,
  setCurrentStep,
}: SetupSidebarProps) {
  return (
    <Card className="bg-slate-900 text-white">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6">Setup Steps</h3>
        <div className="space-y-4">
          {setupSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                  currentStep === step.id ? "bg-blue-600" : "hover:bg-slate-800"
                )}
                onClick={() => setCurrentStep(step.id)}
              >
                <Icon className="h-5 w-5" />
                <div>
                  <div className="font-medium">{step.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
