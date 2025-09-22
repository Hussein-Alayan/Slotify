import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SetupNavigation } from "./SetupNavigation";

// Mock the UI button component
jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    className,
    variant,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  ChevronLeft: ({ className }: { className?: string }) => (
    <span className={className} data-testid="chevron-left-icon" />
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <span className={className} data-testid="chevron-right-icon" />
  ),
}));

describe("SetupNavigation", () => {
  const defaultProps = {
    currentStep: 2,
    totalSteps: 5,
    prevStep: jest.fn(),
    nextStep: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders both navigation buttons", () => {
      render(<SetupNavigation {...defaultProps} />);

      expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    });

    it("displays correct button text", () => {
      render(<SetupNavigation {...defaultProps} />);

      expect(screen.getByText("Back")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
    });

    it("renders chevron icons", () => {
      render(<SetupNavigation {...defaultProps} />);

      expect(screen.getByTestId("chevron-left-icon")).toBeInTheDocument();
      expect(screen.getByTestId("chevron-right-icon")).toBeInTheDocument();
    });

    it("applies correct styling classes to icons", () => {
      render(<SetupNavigation {...defaultProps} />);

      const leftIcon = screen.getByTestId("chevron-left-icon");
      const rightIcon = screen.getByTestId("chevron-right-icon");

      expect(leftIcon).toHaveClass("h-4", "w-4", "mr-2");
      expect(rightIcon).toHaveClass("h-4", "w-4", "ml-2");
    });
  });

  describe("Button States", () => {
    it("disables back button when on first step", () => {
      render(<SetupNavigation {...defaultProps} currentStep={1} />);

      const backButton = screen.getByRole("button", { name: /back/i });
      expect(backButton).toBeDisabled();
    });

    it("enables back button when not on first step", () => {
      render(<SetupNavigation {...defaultProps} currentStep={2} />);

      const backButton = screen.getByRole("button", { name: /back/i });
      expect(backButton).not.toBeDisabled();
    });

    it("shows next button when not on last step", () => {
      render(
        <SetupNavigation {...defaultProps} currentStep={3} totalSteps={5} />
      );

      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    });

    it("hides next button when on last step", () => {
      render(
        <SetupNavigation {...defaultProps} currentStep={5} totalSteps={5} />
      );

      expect(
        screen.queryByRole("button", { name: /next/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Button Interactions", () => {
    it("calls prevStep when back button is clicked", async () => {
      const user = userEvent.setup();
      render(<SetupNavigation {...defaultProps} />);

      const backButton = screen.getByRole("button", { name: /back/i });
      await user.click(backButton);

      expect(defaultProps.prevStep).toHaveBeenCalledTimes(1);
    });

    it("calls nextStep when next button is clicked", async () => {
      const user = userEvent.setup();
      render(<SetupNavigation {...defaultProps} />);

      const nextButton = screen.getByRole("button", { name: /next/i });
      await user.click(nextButton);

      expect(defaultProps.nextStep).toHaveBeenCalledTimes(1);
    });

    it("does not call prevStep when back button is disabled", async () => {
      const user = userEvent.setup();
      render(<SetupNavigation {...defaultProps} currentStep={1} />);

      const backButton = screen.getByRole("button", { name: /back/i });
      await user.click(backButton);

      expect(defaultProps.prevStep).not.toHaveBeenCalled();
    });
  });

  describe("Button Styling", () => {
    it("applies outline variant to back button", () => {
      render(<SetupNavigation {...defaultProps} />);

      const backButton = screen.getByRole("button", { name: /back/i });
      expect(backButton).toHaveAttribute("data-variant", "outline");
    });

    it("applies correct classes to next button", () => {
      render(<SetupNavigation {...defaultProps} />);

      const nextButton = screen.getByRole("button", { name: /next/i });
      expect(nextButton).toHaveClass("bg-slate-900", "hover:bg-slate-800");
    });
  });

  describe("Edge Cases", () => {
    it("handles single step setup", () => {
      render(
        <SetupNavigation {...defaultProps} currentStep={1} totalSteps={1} />
      );

      const backButton = screen.getByRole("button", { name: /back/i });
      expect(backButton).toBeDisabled();
      expect(
        screen.queryByRole("button", { name: /next/i })
      ).not.toBeInTheDocument();
    });

    it("handles step progression correctly", () => {
      const { rerender } = render(
        <SetupNavigation {...defaultProps} currentStep={1} totalSteps={3} />
      );

      // First step
      expect(screen.getByRole("button", { name: /back/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();

      // Middle step
      rerender(
        <SetupNavigation {...defaultProps} currentStep={2} totalSteps={3} />
      );
      expect(screen.getByRole("button", { name: /back/i })).not.toBeDisabled();
      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();

      // Last step
      rerender(
        <SetupNavigation {...defaultProps} currentStep={3} totalSteps={3} />
      );
      expect(screen.getByRole("button", { name: /back/i })).not.toBeDisabled();
      expect(
        screen.queryByRole("button", { name: /next/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Layout Structure", () => {
    it("has proper container structure", () => {
      render(<SetupNavigation {...defaultProps} />);

      const container = document.querySelector(
        ".flex.items-center.justify-between.mt-6"
      );
      expect(container).toBeInTheDocument();
    });

    it("maintains proper button spacing", () => {
      render(<SetupNavigation {...defaultProps} />);

      const container = screen.getByRole("button", {
        name: /back/i,
      }).parentElement;
      expect(container).toHaveClass("flex", "items-center", "justify-between");
    });
  });

  describe("Accessibility", () => {
    it("has proper button roles", () => {
      render(<SetupNavigation {...defaultProps} />);

      expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    });

    it("provides clear button labels", () => {
      render(<SetupNavigation {...defaultProps} />);

      const backButton = screen.getByRole("button", { name: /back/i });
      const nextButton = screen.getByRole("button", { name: /next/i });

      expect(backButton).toHaveAccessibleName();
      expect(nextButton).toHaveAccessibleName();
    });

    it("properly indicates disabled state", () => {
      render(<SetupNavigation {...defaultProps} currentStep={1} />);

      const backButton = screen.getByRole("button", { name: /back/i });
      expect(backButton).toHaveAttribute("disabled");
    });
  });
});
