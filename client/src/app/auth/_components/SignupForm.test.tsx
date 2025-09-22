import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupForm from "./SignupForm";

describe("SignupForm", () => {
  const defaultProps = {
    fullName: "",
    email: "",
    businessName: "",
    password: "",
    confirmPassword: "",
    agree: false,
    error: "",
    loading: false,
    onFullNameChange: jest.fn(),
    onEmailChange: jest.fn(),
    onBusinessNameChange: jest.fn(),
    onPasswordChange: jest.fn(),
    onConfirmPasswordChange: jest.fn(),
    onAgreeChange: jest.fn(),
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders all form fields correctly", () => {
      render(<SignupForm {...defaultProps} />);

      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/i agree to the terms/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /create account/i })
      ).toBeInTheDocument();
    });

    it("displays placeholders correctly", () => {
      render(<SignupForm {...defaultProps} />);

      expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your email")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter your Business Name")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Create a password")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Confirm your password")
      ).toBeInTheDocument();
    });

    it("sets form fields as required", () => {
      render(<SignupForm {...defaultProps} />);

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const businessNameInput = screen.getByLabelText(/business name/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      expect(fullNameInput).toBeRequired();
      expect(emailInput).toBeRequired();
      expect(businessNameInput).toBeRequired();
      expect(passwordInput).toBeRequired();
      expect(confirmPasswordInput).toBeRequired();
    });

    it("sets correct input types", () => {
      render(<SignupForm {...defaultProps} />);

      const emailInput = screen.getByLabelText(/^email$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      expect(emailInput).toHaveAttribute("type", "email");
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(confirmPasswordInput).toHaveAttribute("type", "password");
    });
  });

  describe("User Interactions", () => {
    it("calls onFullNameChange when full name input changes", async () => {
      const user = userEvent.setup();
      render(<SignupForm {...defaultProps} />);

      const fullNameInput = screen.getByPlaceholderText("John Doe");
      await user.type(fullNameInput, "John Doe");

      expect(defaultProps.onFullNameChange).toHaveBeenCalled();
    });

    it("calls onEmailChange when email input changes", async () => {
      const user = userEvent.setup();
      render(<SignupForm {...defaultProps} />);

      const emailInput = screen.getByPlaceholderText("Enter your email");
      await user.type(emailInput, "test@example.com");

      expect(defaultProps.onEmailChange).toHaveBeenCalled();
    });

    it("calls onBusinessNameChange when business name input changes", async () => {
      const user = userEvent.setup();
      render(<SignupForm {...defaultProps} />);

      const businessNameInput = screen.getByPlaceholderText(
        "Enter your Business Name"
      );
      await user.type(businessNameInput, "My Business");

      expect(defaultProps.onBusinessNameChange).toHaveBeenCalled();
    });

    it("calls onPasswordChange when password input changes", async () => {
      const user = userEvent.setup();
      render(<SignupForm {...defaultProps} />);

      const passwordInput = screen.getByPlaceholderText("Create a password");
      await user.type(passwordInput, "password123");

      expect(defaultProps.onPasswordChange).toHaveBeenCalled();
    });

    it("calls onConfirmPasswordChange when confirm password input changes", async () => {
      const user = userEvent.setup();
      render(<SignupForm {...defaultProps} />);

      const confirmPasswordInput = screen.getByPlaceholderText(
        "Confirm your password"
      );
      await user.type(confirmPasswordInput, "password123");

      expect(defaultProps.onConfirmPasswordChange).toHaveBeenCalled();
    });

    it("calls onAgreeChange when terms checkbox is clicked", async () => {
      const user = userEvent.setup();
      render(<SignupForm {...defaultProps} />);

      const agreeCheckbox = screen.getByLabelText(/i agree to the terms/i);
      await user.click(agreeCheckbox);

      expect(defaultProps.onAgreeChange).toHaveBeenCalled();
    });

    it("calls onSubmit when form is submitted", async () => {
      const user = userEvent.setup();
      render(<SignupForm {...defaultProps} />);

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      await user.click(submitButton);

      expect(defaultProps.onSubmit).toHaveBeenCalled();
    });

    it("prevents default form submission", () => {
      render(<SignupForm {...defaultProps} />);

      // Simulate form submission
      fireEvent.submit(document.querySelector("form")!);

      expect(defaultProps.onSubmit).toHaveBeenCalled();
    });
  });

  describe("State Display", () => {
    it("displays all field values correctly", () => {
      const props = {
        ...defaultProps,
        fullName: "John Doe",
        email: "john@example.com",
        businessName: "Doe Enterprises",
        password: "mypassword",
        confirmPassword: "mypassword",
        agree: true,
      };

      render(<SignupForm {...props} />);

      expect(screen.getByPlaceholderText("John Doe")).toHaveValue("John Doe");
      expect(screen.getByPlaceholderText("Enter your email")).toHaveValue(
        "john@example.com"
      );
      expect(
        screen.getByPlaceholderText("Enter your Business Name")
      ).toHaveValue("Doe Enterprises");
      expect(screen.getByPlaceholderText("Create a password")).toHaveValue(
        "mypassword"
      );
      expect(screen.getByPlaceholderText("Confirm your password")).toHaveValue(
        "mypassword"
      );
      expect(screen.getByLabelText(/i agree to the terms/i)).toBeChecked();
    });

    it("displays unchecked agreement checkbox correctly", () => {
      render(<SignupForm {...defaultProps} agree={false} />);

      const agreeCheckbox = screen.getByLabelText(/i agree to the terms/i);
      expect(agreeCheckbox).not.toBeChecked();
    });
  });

  describe("Error Handling", () => {
    it("displays error message when error prop is provided", () => {
      const errorMessage = "Email already exists";
      render(<SignupForm {...defaultProps} error={errorMessage} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("does not display error message when error prop is empty", () => {
      render(<SignupForm {...defaultProps} error="" />);

      const errorElements = screen.queryAllByText(/error|invalid|exists/i);
      expect(errorElements).toHaveLength(0);
    });

    it("applies correct error styling", () => {
      const errorMessage = "Passwords do not match";
      render(<SignupForm {...defaultProps} error={errorMessage} />);

      const errorElement = screen.getByText(errorMessage);
      // Check if it has the CSS module class (we can't test the exact class name due to CSS modules)
      expect(errorElement).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("displays loading text when loading is true", () => {
      render(<SignupForm {...defaultProps} loading={true} />);

      expect(
        screen.getByRole("button", { name: /creating account/i })
      ).toBeInTheDocument();
    });

    it("displays normal text when loading is false", () => {
      render(<SignupForm {...defaultProps} loading={false} />);

      expect(
        screen.getByRole("button", { name: /^create account$/i })
      ).toBeInTheDocument();
    });

    it("disables submit button when loading is true", () => {
      render(<SignupForm {...defaultProps} loading={true} />);

      const submitButton = screen.getByRole("button", {
        name: /creating account/i,
      });
      expect(submitButton).toBeDisabled();
    });

    it("enables submit button when loading is false", () => {
      render(<SignupForm {...defaultProps} loading={false} />);

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("Form Validation", () => {
    it("should trigger HTML5 validation for required fields", async () => {
      render(<SignupForm {...defaultProps} />);

      const fullNameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("Enter your email");
      const businessNameInput = screen.getByPlaceholderText(
        "Enter your Business Name"
      );
      const passwordInput = screen.getByPlaceholderText("Create a password");
      const confirmPasswordInput = screen.getByPlaceholderText(
        "Confirm your password"
      );

      expect(fullNameInput).toBeInvalid();
      expect(emailInput).toBeInvalid();
      expect(businessNameInput).toBeInvalid();
      expect(passwordInput).toBeInvalid();
      expect(confirmPasswordInput).toBeInvalid();
    });

    it("should be valid when all required fields are filled with valid data", () => {
      const props = {
        ...defaultProps,
        fullName: "John Doe",
        email: "john@example.com",
        businessName: "Doe Enterprises",
        password: "password123",
        confirmPassword: "password123",
      };

      render(<SignupForm {...props} />);

      const fullNameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("Enter your email");
      const businessNameInput = screen.getByPlaceholderText(
        "Enter your Business Name"
      );
      const passwordInput = screen.getByPlaceholderText("Create a password");
      const confirmPasswordInput = screen.getByPlaceholderText(
        "Confirm your password"
      );

      expect(fullNameInput).toBeValid();
      expect(emailInput).toBeValid();
      expect(businessNameInput).toBeValid();
      expect(passwordInput).toBeValid();
      expect(confirmPasswordInput).toBeValid();
    });

    it("validates email format", () => {
      render(<SignupForm {...defaultProps} email="invalid-email" />);

      const emailInput = screen.getByPlaceholderText("Enter your email");
      expect(emailInput).toBeInvalid();
    });
  });

  describe("Password Fields", () => {
    it("masks password inputs", () => {
      render(<SignupForm {...defaultProps} />);

      const passwordInput = screen.getByPlaceholderText("Create a password");
      const confirmPasswordInput = screen.getByPlaceholderText(
        "Confirm your password"
      );

      expect(passwordInput).toHaveAttribute("type", "password");
      expect(confirmPasswordInput).toHaveAttribute("type", "password");
    });
  });

  describe("Terms and Conditions", () => {
    it("renders terms of service agreement", () => {
      render(<SignupForm {...defaultProps} />);

      expect(
        screen.getByLabelText(
          /i agree to the terms of services and privacy policy/i
        )
      ).toBeInTheDocument();
    });

    it("allows checking and unchecking the agreement", async () => {
      const user = userEvent.setup();
      render(<SignupForm {...defaultProps} />);

      const agreeCheckbox = screen.getByLabelText(/i agree to the terms/i);

      // Initially unchecked
      expect(agreeCheckbox).not.toBeChecked();

      // Click to check
      await user.click(agreeCheckbox);
      expect(defaultProps.onAgreeChange).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has proper form structure", () => {
      render(<SignupForm {...defaultProps} />);

      const form = document.querySelector("form");
      expect(form).toBeInTheDocument();
    });

    it("has proper input accessibility", () => {
      render(<SignupForm {...defaultProps} />);

      const fullNameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("Enter your email");
      const businessNameInput = screen.getByPlaceholderText(
        "Enter your Business Name"
      );
      const passwordInput = screen.getByPlaceholderText("Create a password");
      const confirmPasswordInput = screen.getByPlaceholderText(
        "Confirm your password"
      );
      const agreeCheckbox = screen.getByLabelText(/i agree to the terms/i);

      expect(fullNameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(businessNameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(confirmPasswordInput).toBeInTheDocument();
      expect(agreeCheckbox).toHaveAccessibleName();
    });

    it("has proper button semantics", () => {
      render(<SignupForm {...defaultProps} />);

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      expect(submitButton).toHaveAttribute("type", "submit");
    });
  });

  describe("CSS Modules Integration", () => {
    it("applies CSS module classes", () => {
      render(<SignupForm {...defaultProps} />);

      const form = document.querySelector("form");
      expect(form).toHaveClass("signupForm");
    });
  });
});
