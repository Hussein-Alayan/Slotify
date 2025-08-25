"use client";
import React from "react";

import Input from "@/components/Input";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Divider from "@/components/Divider";
import ForgotPasswordLink from "@/components/ForgotPasswordLink";
import GoogleButton from "@/components/GoogleButton";
import Image from "next/image";

export default function SignInPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    email?: string;
    password?: string;
  }>({});
  const [submitting, setSubmitting] = React.useState(false);

  function validate() {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      newErrors.email = "Invalid email address.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    return newErrors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSubmitting(true);
      // TODO: Add actual sign-in logic here
      setTimeout(() => {
        setSubmitting(false);
        alert("Signed in successfully (demo)");
      }, 1000);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-[var(--color-primary)] flex items-center justify-center mb-4 overflow-hidden">
            <Image
              src="/logos/Dark-noText.svg"
              alt="Slotify Logo"
              width={70}
              height={70}
            />
          </div>
          <span className="font-bold text-[var(--color-primary)] text-lg tracking-wide">
            SLOTIFY
          </span>
        </div>
        <h2 className="text-center text-lg font-medium mb-2">
          Welcome back! Please sign in to your account
        </h2>
        <form
          className="w-full max-w-sm space-y-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={submitting}
          />
          {errors.email && (
            <div className="text-red-500 text-xs mb-2">{errors.email}</div>
          )}
          <Input
            label="Password"
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={submitting}
          />
          {errors.password && (
            <div className="text-red-500 text-xs mb-2">{errors.password}</div>
          )}
          <div className="mt-6">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </form>
        <Divider>Or continue with</Divider>
        <GoogleButton />
        <div className="flex items-center justify-between w-full max-w-sm mb-8 gap-4">
          <Checkbox
            label="Remember me"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            disabled={submitting}
          />
          <ForgotPasswordLink />
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="#" className="font-semibold text-[var(--color-primary)]">
            Sign up
          </a>
        </div>
      </div>
      {/* Right Side - Illustration & Text */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-[var(--color-primary)] text-white p-8">
        <div>
          <Image
            src="/icons/calender.svg"
            alt="Calendar Icon"
            width={120}
            height={120}
          />
        </div>
        <div className="h-24" />
        <h2 className="text-2xl font-semibold mb-2">
          Streamline Your Scheduling
        </h2>
        <p className="text-center max-w-xs text-base opacity-80">
          Manage appointments, bookings, and time slots with our intuitive
          platform designed for modern businesses.
        </p>
      </div>
    </div>
  );
}
