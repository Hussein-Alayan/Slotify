import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SigninForm from "./SigninForm";

describe("SigninForm", () => {
  const defaultProps = {
    email: "",
    password: "",
    remember: false,
    error: "",
    loading: false,
    onEmailChange: jest.fn(),
    onPasswordChange: jest.fn(),
    onRememberChange: jest.fn(),
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders all form fields correctly", () => {
      render(<SigninForm {...defaultProps} />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign in/i })
      ).toBeInTheDocument();
    });

    it("displays placeholders correctly", () => {
      render(<SigninForm {...defaultProps} />);

      expect(
        screen.getByPlaceholderText("Enter your email")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your Password")
      ).toBeInTheDocument();
    });

    it("sets form fields as required", () => {
      render(<SigninForm {...defaultProps} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    it("sets correct input types", () => {
      render(<SigninForm {...defaultProps} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toHaveAttribute("type", "email");
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  describe("User Interactions", () => {
    it("calls onEmailChange when email input changes", async () => {
      const user = userEvent.setup();
      render(<SigninForm {...defaultProps} />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "test@example.com");

      expect(defaultProps.onEmailChange).toHaveBeenCalled();
    });

    it("calls onPasswordChange when password input changes", async () => {
      const user = userEvent.setup();
      render(<SigninForm {...defaultProps} />);

      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, "password123");

      expect(defaultProps.onPasswordChange).toHaveBeenCalled();
    });

    it("calls onRememberChange when remember me checkbox is clicked", async () => {
      const user = userEvent.setup();
      render(<SigninForm {...defaultProps} />);

      const rememberCheckbox = screen.getByLabelText(/remember me/i);
      await user.click(rememberCheckbox);

      expect(defaultProps.onRememberChange).toHaveBeenCalled();
    });

    it("calls onSubmit when form is submitted", async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn((e) => e.preventDefault());

      render(<SigninForm {...defaultProps} onSubmit={mockOnSubmit} />);

      // Fill in required fields first
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");

      // Submit the form directly
      const form = screen.getByRole("form");
      fireEvent.submit(form);

      expect(mockOnSubmit).toHaveBeenCalled();
    });

    it("prevents default form submission", () => {
      render(<SigninForm {...defaultProps} />);

      // Simulate form submission
      fireEvent.submit(
        screen.getByRole("form") ||
          screen.getByTestId("signin-form") ||
          document.querySelector("form")!
      );

      expect(defaultProps.onSubmit).toHaveBeenCalled();
    });
  });

  describe("State Display", () => {
    it("displays email value correctly", () => {
      render(<SigninForm {...defaultProps} email="test@example.com" />);

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveValue("test@example.com");
    });

    it("displays password value correctly", () => {
      render(<SigninForm {...defaultProps} password="mypassword" />);

      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveValue("mypassword");
    });

    it("displays remember me checked state correctly", () => {
      render(<SigninForm {...defaultProps} remember={true} />);

      const rememberCheckbox = screen.getByLabelText(/remember me/i);
      expect(rememberCheckbox).toBeChecked();
    });

    it("displays remember me unchecked state correctly", () => {
      render(<SigninForm {...defaultProps} remember={false} />);

      const rememberCheckbox = screen.getByLabelText(/remember me/i);
      expect(rememberCheckbox).not.toBeChecked();
    });
  });

  describe("Error Handling", () => {
    it("displays error message when error prop is provided", () => {
      const errorMessage = "Invalid credentials";
      render(<SigninForm {...defaultProps} error={errorMessage} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toHaveClass("text-red-500");
    });

    it("does not display error message when error prop is empty", () => {
      render(<SigninForm {...defaultProps} error="" />);

      const errorElements = screen.queryAllByText(/error|invalid|wrong/i);
      expect(errorElements).toHaveLength(0);
    });

    it("applies correct error styling", () => {
      const errorMessage = "Network error occurred";
      render(<SigninForm {...defaultProps} error={errorMessage} />);

      const errorElement = screen.getByText(errorMessage);
      expect(errorElement).toHaveClass(
        "text-red-500",
        "text-sm",
        "text-center"
      );
    });
  });

  describe("Loading States", () => {
    it("displays loading text when loading is true", () => {
      render(<SigninForm {...defaultProps} loading={true} />);

      expect(
        screen.getByRole("button", { name: /signing in/i })
      ).toBeInTheDocument();
    });

    it("displays normal text when loading is false", () => {
      render(<SigninForm {...defaultProps} loading={false} />);

      expect(
        screen.getByRole("button", { name: /^sign in$/i })
      ).toBeInTheDocument();
    });

    it("disables submit button when loading is true", () => {
      render(<SigninForm {...defaultProps} loading={true} />);

      const submitButton = screen.getByRole("button", { name: /signing in/i });
      expect(submitButton).toBeDisabled();
    });

    it("enables submit button when loading is false", () => {
      render(<SigninForm {...defaultProps} loading={false} />);

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("Form Validation", () => {
    it("should trigger HTML5 validation for required fields", async () => {
      render(<SigninForm {...defaultProps} />);

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      fireEvent.click(submitButton);

      // HTML5 validation should prevent submission of empty required fields
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toBeInvalid();
      expect(passwordInput).toBeInvalid();
    });

    it("should be valid when all required fields are filled", () => {
      render(
        <SigninForm
          {...defaultProps}
          email="test@example.com"
          password="password123"
        />
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toBeValid();
      expect(passwordInput).toBeValid();
    });
  });

  describe("Accessibility", () => {
    it("has proper form structure", () => {
      render(<SigninForm {...defaultProps} />);

      const form = document.querySelector("form");
      expect(form).toBeInTheDocument();
    });

    it("associates labels with inputs correctly", () => {
      render(<SigninForm {...defaultProps} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const rememberCheckbox = screen.getByLabelText(/remember me/i);

      expect(emailInput).toHaveAccessibleName();
      expect(passwordInput).toHaveAccessibleName();
      expect(rememberCheckbox).toHaveAccessibleName();
    });

    it("has proper button semantics", () => {
      render(<SigninForm {...defaultProps} />);

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      expect(submitButton).toHaveAttribute("type", "submit");
    });
  });
});
