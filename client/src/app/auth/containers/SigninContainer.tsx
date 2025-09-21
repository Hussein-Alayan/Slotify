"use client";
interface LoginResponse {
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      created_at: string;
      updated_at: string;
    };
    token: string;
  };
  success: boolean;
}
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";
import api, { csrf } from "@/lib/api";
import { getErrorMessage } from "@/utils/errorMessage";
import SigninForm from "../_components/SigninForm";
import Link from "next/link";
import Image from "next/image";
import styles from "../signin/page.module.css";

const SigninContainer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect if already authenticated
  useRedirectIfAuthenticated();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      await csrf();
      const response = await api.post<LoginResponse>("/v1/login", {
        email,
        password,
      });
      setLoading(false);
      // Save user name to localStorage if available in response
      if (response.data.data.user.name) {
        localStorage.setItem("user_name", response.data.data.user.name);
      }
      router.push("/business-hub");
    } catch (err: unknown) {
      setLoading(false);
      setError(getErrorMessage(err, "Login failed."));
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        {/* Left Side - Form */}
        <div className={styles.leftCol}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <div className={styles.logoCircle}>
              <Image
                src="/logos/Dark-noText.svg"
                alt="Slotify Logo"
                width={80}
                height={80}
              />
            </div>
            <span className={styles.slotifyText}>SLOTIFY</span>
          </div>
          {/* Welcome Text */}
          <div className="mb-6 text-center">
            <p className="text-base text-gray-700">
              Welcome back! Please sign in to your account
            </p>
          </div>
          {/* Form */}
          <SigninForm
            email={email}
            password={password}
            remember={remember}
            error={error}
            loading={loading}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onRememberChange={(e) => setRemember(e.target.checked)}
            onSubmit={handleSubmit}
          />
          {/* Options Row */}
          <div className="w-full max-w-md flex flex-col items-center gap-4 mb-4">
            <div className="w-full flex items-center justify-between">
              <Link
                href="#"
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className={styles.loginFooter}>
              <span className="text-base text-[var(--color-primary)]">
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="font-bold hover:underline">
                  Sign up
                </Link>
              </span>
            </div>
          </div>
        </div>
        {/* Right Side - Illustration */}
        <div className="flex flex-col flex-1 items-center justify-center bg-[var(--color-primary)] text-white p-12">
          <Image
            src="/icons/calender.svg"
            alt="Calendar Icon"
            width={120}
            height={120}
            className={styles.calendarIcon}
          />
          <h2 className="text-2xl font-bold mb-4 text-center">
            Streamline Your Scheduling
          </h2>
          <p className="text-center text-base text-white/80 max-w-xs">
            Manage appointments, bookings, and time slots with our intuitive
            platform designed for modern businesses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninContainer;
