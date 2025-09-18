"use client";
import React, { useState } from "react";
import api, { csrf } from "@/lib/api";
import { getErrorMessage } from "@/utils/errorMessage";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";
import SignupForm from "../_components/SignupForm";
import Link from "next/link";
import Image from "next/image";
import styles from "../signup/page.module.css";

const SignupContainer: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useRedirectIfAuthenticated();

  const handleSubmit = async (e: React.FormEvent) => {
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
    try {
      await csrf();
      await api.post("/v1/register", {
        name: fullName,
        email,
        business_name: businessName,
        password,
        password_confirmation: confirmPassword,
      });
      setLoading(false);
      alert("Account created!");
      // Optionally redirect to signin or dashboard
    } catch (err: unknown) {
      setLoading(false);
      setError(getErrorMessage(err, "Registration failed."));
    }
  };

  return (
    <div className={styles.signupPage}>
      {/* Left Side - Info */}
      <div className={styles.signupLeft}>
        <div className={styles.signupLogo}>
          <Image
            src="/icons/signup.svg"
            alt="Signup"
            width={120}
            height={120}
          />
        </div>
        <h2 className={styles.signupTitle}>Join Thousands of Businesses</h2>
        <p className={styles.signupDesc}>
          Start managing your appointments more efficiently and grow your
          business with our powerful scheduling tools.
        </p>
      </div>
      {/* Right Side - Logo & Form */}
      <div className={styles.signupRight}>
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
        <h3 className={styles.signupTitle}>
          Create your account and start scheduling
        </h3>
        <SignupForm
          fullName={fullName}
          email={email}
          businessName={businessName}
          password={password}
          confirmPassword={confirmPassword}
          agree={agree}
          error={error}
          loading={loading}
          onFullNameChange={(e) => setFullName(e.target.value)}
          onEmailChange={(e) => setEmail(e.target.value)}
          onBusinessNameChange={(e) => setBusinessName(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
          onAgreeChange={(e) => setAgree(e.target.checked)}
          onSubmit={handleSubmit}
        />
        <div className={styles.signupFooter}>
          <span className="text-base text-[var(--color-primary)]">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-bold hover:underline">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignupContainer;
