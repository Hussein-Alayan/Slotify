import React from "react";
import Input from "@/components/shared/Input";
import Checkbox from "@/components/shared/Checkbox";
import Button from "@/components/Button";
import styles from "../signup/page.module.css";

interface SignupFormProps {
  fullName: string;
  email: string;
  businessName: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
  error: string;
  loading: boolean;
  onFullNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBusinessNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAgreeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  fullName,
  email,
  businessName,
  password,
  confirmPassword,
  agree,
  error,
  loading,
  onFullNameChange,
  onEmailChange,
  onBusinessNameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onAgreeChange,
  onSubmit,
}) => (
  <form
    className={styles.signupForm}
    onSubmit={onSubmit}
    role="form"
    data-testid="signup-form"
  >
    <Input
      label="Full Name"
      value={fullName}
      onChange={onFullNameChange}
      placeholder="John Doe"
      required
    />
    <Input
      label="Email"
      value={email}
      onChange={onEmailChange}
      placeholder="Enter your email"
      type="email"
      required
    />
    <Input
      label="Business Name"
      value={businessName}
      onChange={onBusinessNameChange}
      placeholder="Enter your Business Name"
      required
    />
    <Input
      label="Password"
      value={password}
      onChange={onPasswordChange}
      placeholder="Create a password"
      type="password"
      required
    />
    <Input
      label="Confirm Password"
      value={confirmPassword}
      onChange={onConfirmPasswordChange}
      placeholder="Confirm your password"
      type="password"
      required
    />
    <div style={{ marginTop: "0.5rem" }}>
      <Checkbox
        label="I agree to the Terms of Services and privacy policy"
        checked={agree}
        onChange={onAgreeChange}
      />
    </div>
    {error && <div className={styles.signupError}>{error}</div>}
    <Button type="submit" disabled={loading} className="mt-2">
      {loading ? "Creating Account..." : "Create Account"}
    </Button>
  </form>
);

export default SignupForm;
