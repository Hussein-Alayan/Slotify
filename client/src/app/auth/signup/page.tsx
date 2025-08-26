"use client";
import React, { useState } from "react";
import Input from "@/components/shared/Input";
import Checkbox from "@/components/shared/Checkbox";
import Button from "@/components/Button";
import Image from "next/image";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName || !email || !businessName || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agree) {
      setError("You must agree to the Terms of Services and privacy policy.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Account created!");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="flex-1 bg-[#0a2940] flex flex-col items-center justify-center text-white p-8">
        <div className="mb-8">
          <Image
            src="/icons/presentation.svg"
            alt="Presentation"
            width={120}
            height={120}
          />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-center">
          Join Thousands of Businesses
        </h2>
        <p className="text-center text-base text-white/80 max-w-xs">
          Start managing your appointments more efficiently and grow your
          business with our powerful scheduling tools.
        </p>
      </div>
      {/* Right Side */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
        <div className="mb-6 flex flex-col items-center">
          <Image
            src="/icons/calender.svg"
            alt="Slotify Logo"
            width={80}
            height={80}
          />
          <span className="mt-2 text-lg font-bold text-[#0a2940]">SLOTIFY</span>
        </div>
        <h3 className="mb-4 text-center text-base text-gray-700">
          Create your account and start scheduling
        </h3>
        <form
          className="w-full max-w-md flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
          />
          <Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            type="email"
            required
          />
          <Input
            label="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Enter your Business Name"
            required
          />
          <Input
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            type="password"
            required
          />
          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            type="password"
            required
          />
          <div className="flex items-center gap-2 mt-2">
            <Checkbox
              label="I agree to the Terms of Services and privacy policy"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center mt-2">{error}</div>
          )}
          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="font-bold text-[#0a2940] hover:underline"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
