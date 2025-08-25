import React from "react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-[var(--color-primary)] flex items-center justify-center mb-4">
            {/* Replace with your logo SVG or image */}
            <span className="text-white text-4xl">📅</span>
          </div>
          <span className="font-bold text-[var(--color-primary)] text-lg tracking-wide">
            SLOTIFY
          </span>
        </div>
        <h2 className="text-center text-lg font-medium mb-2">
          Welcome back! Please sign in to your account
        </h2>
        <form className="w-full max-w-sm space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-[var(--color-primary)] rounded px-3 py-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your Password"
              className="w-full border border-[var(--color-primary)] rounded px-3 py-2 outline-none"
            />
          </div>
          <button
            type="button"
            className="w-full bg-[var(--color-primary)] text-white py-2 rounded font-semibold"
          >
            Sign In
          </button>
        </form>
        <div className="flex items-center w-full max-w-sm my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-sm">Or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <button className="w-full max-w-sm border border-[var(--color-primary)] rounded py-2 flex items-center justify-center font-semibold text-[var(--color-primary)] mb-4">
          <span className="mr-2 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-sm">
            G
          </span>
        </button>
        <div className="flex items-center justify-between w-full max-w-sm mb-4">
          <label className="flex items-center text-sm">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <a
            href="#"
            className="text-sm text-[var(--color-primary)] font-medium"
          >
            Forgot password?
          </a>
        </div>
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <a href="#" className="font-semibold text-[var(--color-primary)]">
            Sign up
          </a>
        </div>
      </div>
      {/* Right Side - Illustration & Text */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-[var(--color-primary)] text-white p-8">
        <div className="mb-8">
          {/* Replace with your calendar SVG or image */}
          <span className="text-7xl">📅</span>
        </div>
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
