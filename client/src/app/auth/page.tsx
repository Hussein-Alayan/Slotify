import React from "react";

import Input from "@/components/Input";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Divider from "@/components/Divider";
import ForgotPasswordLink from "@/components/ForgotPasswordLink";
import GoogleButton from "@/components/GoogleButton";
import Image from "next/image";

export default function SignInPage() {
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
        <form className="w-full max-w-sm space-y-6">
          <Input label="Email" type="email" placeholder="Enter your email" />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your Password"
          />
          <div className="mt-6">
            <Button type="button">Sign In</Button>
          </div>
        </form>
        <Divider>Or continue with</Divider>
        <GoogleButton />
        <div className="flex items-center justify-between w-full max-w-sm mb-8 gap-4">
          <Checkbox label="Remember me" />
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
