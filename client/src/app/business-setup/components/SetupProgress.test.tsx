import React from "react";
import { render, screen } from "@testing-library/react";
import { SetupProgress, SetupStep } from "./SetupProgress";
import { User, Building, Settings } from "lucide-react";

// Mock the utility function
jest.mock("@/lib/utils", () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  User: () => <span data-testid="user-icon" />,
  Building: () => <span data-testid="building-icon" />,
  Settings: () => <span data-testid="settings-icon" />,
}));

describe("SetupProgress", () => {
  const mockSetupSteps: SetupStep[] = [
    {
      id: 1,
      name: "Business Profile",
      icon: User,
      description: "Basic business information",
    },
    {
      id: 2,
      name: "Services",
      icon: Building,
      description: "Add your services",
    },
    {
      id: 3,
      name: "Settings",
      icon: Settings,
      description: "Configure settings",
    },
  ];

  const defaultProps = {
    setupSteps: mockSetupSteps,
    currentStep: 2,
  };

  describe("Rendering", () => {
    it("renders the setup progress header", () => {
      render(<SetupProgress {...defaultProps} />);

      expect(screen.getByText("Setup Progress")).toBeInTheDocument();
    });

    it("displays current step and total steps", () => {
      render(<SetupProgress {...defaultProps} />);

      expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
    });

    it("renders all setup steps", () => {
      render(<SetupProgress {...defaultProps} />);

      expect(screen.getByText("Business Profile")).toBeInTheDocument();
      expect(screen.getByText("Services")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("displays step numbers correctly", () => {
      render(<SetupProgress {...defaultProps} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  describe("Step Status Styling", () => {
    it("styles current step with correct classes", () => {
      render(<SetupProgress {...defaultProps} currentStep={2} />);

      const currentStepCircle = screen.getByText("2");
      expect(currentStepCircle).toHaveClass("bg-slate-900", "text-white");

      const currentStepText = screen.getByText("Services");
      expect(currentStepText).toHaveClass("text-slate-900");
    });

    it("styles completed steps with correct classes", () => {
      render(<SetupProgress {...defaultProps} currentStep={3} />);

      // Step 1 and 2 should be completed
      const completedStepCircle = screen.getByText("1");
      expect(completedStepCircle).toHaveClass("bg-blue-600", "text-white");

      const completedStepText = screen.getByText("Business Profile");
      expect(completedStepText).toHaveClass("text-gray-600");
    });

    it("styles upcoming steps with correct classes", () => {
      render(<SetupProgress {...defaultProps} currentStep={1} />);

      // Step 2 and 3 should be upcoming
      const upcomingStepCircle = screen.getByText("2");
      expect(upcomingStepCircle).toHaveClass("bg-gray-200", "text-gray-600");

      const upcomingStepText = screen.getByText("Services");
      expect(upcomingStepText).toHaveClass("text-gray-600");
    });
  });

  describe("Progress Indicators", () => {
    it("shows separators between steps", () => {
      render(<SetupProgress {...defaultProps} />);

      const separators = document.querySelectorAll(
        ".w-8.h-px.bg-gray-300.mx-4"
      );
      expect(separators).toHaveLength(2); // Should have n-1 separators for n steps
    });

    it("does not show separator after last step", () => {
      const singleStepProps = {
        setupSteps: [mockSetupSteps[0]],
        currentStep: 1,
      };

      render(<SetupProgress {...singleStepProps} />);

      const separators = document.querySelectorAll(
        ".w-8.h-px.bg-gray-300.mx-4"
      );
      expect(separators).toHaveLength(0);
    });
  });

  describe("Step Progression", () => {
    it("correctly identifies current step", () => {
      const { rerender } = render(
        <SetupProgress {...defaultProps} currentStep={1} />
      );

      expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
      let currentStepElement = screen.getByText("1");
      expect(currentStepElement).toHaveClass("bg-slate-900");

      rerender(<SetupProgress {...defaultProps} currentStep={2} />);
      expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
      currentStepElement = screen.getByText("2");
      expect(currentStepElement).toHaveClass("bg-slate-900");
    });

    it("correctly identifies completed steps", () => {
      render(<SetupProgress {...defaultProps} currentStep={3} />);

      const step1Circle = screen.getByText("1");
      const step2Circle = screen.getByText("2");

      expect(step1Circle).toHaveClass("bg-blue-600");
      expect(step2Circle).toHaveClass("bg-blue-600");
    });

    it("correctly identifies upcoming steps", () => {
      render(<SetupProgress {...defaultProps} currentStep={1} />);

      const step2Circle = screen.getByText("2");
      const step3Circle = screen.getByText("3");

      expect(step2Circle).toHaveClass("bg-gray-200");
      expect(step3Circle).toHaveClass("bg-gray-200");
    });
  });

  describe("Layout Structure", () => {
    it("has proper container structure", () => {
      render(<SetupProgress {...defaultProps} />);

      expect(
        document.querySelector(".bg-white.px-6.py-4.border-b")
      ).toBeInTheDocument();
      expect(document.querySelector(".max-w-7xl.mx-auto")).toBeInTheDocument();
    });

    it("maintains proper step layout", () => {
      render(<SetupProgress {...defaultProps} />);

      const stepsContainer = document.querySelector(".flex.items-center.gap-4");
      expect(stepsContainer).toBeInTheDocument();
    });

    it("structures individual steps correctly", () => {
      render(<SetupProgress {...defaultProps} />);

      const stepElements = document.querySelectorAll(".flex.items-center");
      expect(stepElements.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("handles single step setup", () => {
      const singleStepProps = {
        setupSteps: [mockSetupSteps[0]],
        currentStep: 1,
      };

      render(<SetupProgress {...singleStepProps} />);

      expect(screen.getByText("Step 1 of 1")).toBeInTheDocument();
      expect(screen.getByText("Business Profile")).toBeInTheDocument();
    });

    it("handles empty setup steps array", () => {
      const emptyStepsProps = {
        setupSteps: [],
        currentStep: 0,
      };

      render(<SetupProgress {...emptyStepsProps} />);

      expect(screen.getByText("Step 0 of 0")).toBeInTheDocument();
    });

    it("handles step progression at boundaries", () => {
      // Test at first step
      const { rerender } = render(
        <SetupProgress {...defaultProps} currentStep={1} />
      );
      expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();

      // Test at last step
      rerender(<SetupProgress {...defaultProps} currentStep={3} />);
      expect(screen.getByText("Step 3 of 3")).toBeInTheDocument();
    });
  });

  describe("Typography and Styling", () => {
    it("applies correct typography classes", () => {
      render(<SetupProgress {...defaultProps} />);

      const title = screen.getByText("Setup Progress");
      expect(title).toHaveClass("text-lg", "font-semibold");

      const stepCounter = screen.getByText("Step 2 of 3");
      expect(stepCounter).toHaveClass("text-sm", "text-gray-600");
    });

    it("applies correct styling to step names", () => {
      render(<SetupProgress {...defaultProps} currentStep={1} />);

      const currentStepName = screen.getByText("Business Profile");
      expect(currentStepName).toHaveClass("ml-2", "text-sm", "font-medium");
    });

    it("applies correct styling to step circles", () => {
      render(<SetupProgress {...defaultProps} />);

      const stepCircles = document.querySelectorAll(
        ".w-8.h-8.rounded-full.flex.items-center.justify-center.text-sm.font-medium"
      );
      expect(stepCircles).toHaveLength(3);
    });
  });

  describe("Accessibility", () => {
    it("has proper semantic structure", () => {
      render(<SetupProgress {...defaultProps} />);

      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });

    it("provides clear step identification", () => {
      render(<SetupProgress {...defaultProps} />);

      expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
      mockSetupSteps.forEach((step) => {
        expect(screen.getByText(step.name)).toBeInTheDocument();
      });
    });
  });
});
