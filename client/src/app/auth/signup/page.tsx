"use client";
import React, { useState } from "react";
import api, { csrf } from "@/lib/api";
import Input from "@/components/shared/Input";
import Checkbox from "@/components/shared/Checkbox";
import Button from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.message || "Registration failed.");
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
        <form className={styles.signupForm} onSubmit={handleSubmit}>
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
          <div style={{ marginTop: "0.5rem" }}>
            <Checkbox
              label="I agree to the Terms of Services and privacy policy"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
          </div>
          {error && <div className={styles.signupError}>{error}</div>}
          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
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
}
