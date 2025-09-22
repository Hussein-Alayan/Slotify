import React from "react";
import Input from "@/components/shared/Input";
import Button from "@/components/Button";
import Checkbox from "@/components/shared/Checkbox";

interface SigninFormProps {
  email: string;
  password: string;
  remember: boolean;
  error: string;
  loading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRememberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SigninForm: React.FC<SigninFormProps> = ({
  email,
  password,
  remember,
  error,
  loading,
  onEmailChange,
  onPasswordChange,
  onRememberChange,
  onSubmit,
}) => (
  <form
    className="w-full max-w-md flex flex-col gap-4"
    onSubmit={onSubmit}
    role="form"
    data-testid="signin-form"
  >
    <Input
      label="Email"
      placeholder="Enter your email"
      type="email"
      value={email}
      onChange={onEmailChange}
      required
    />
    <Input
      label="Password"
      placeholder="Enter your Password"
      type="password"
      value={password}
      onChange={onPasswordChange}
      required
    />
    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
    <Button type="submit" disabled={loading}>
      {loading ? "Signing In..." : "Sign In"}
    </Button>
    <div className="w-full max-w-md flex flex-col items-center gap-4 mb-4">
      <div className="w-full flex items-center justify-between">
        <Checkbox
          label="Remember me"
          checked={remember}
          onChange={onRememberChange}
        />
        {/* Forgot password link can be added here */}
      </div>
    </div>
  </form>
);

export default SigninForm;
