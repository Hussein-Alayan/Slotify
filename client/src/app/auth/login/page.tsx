import Image from "next/image";
import Input from "@/components/shared/Input";
import Button from "@/components/Button";
import Checkbox from "@/components/shared/Checkbox";
import Divider from "@/components/shared/Divider";

export default function LoginPage() {
  return (
    <div className="w-screen h-screen flex bg-[#232323]">
      <div className="flex flex-1 bg-white rounded-none overflow-hidden shadow-lg">
        {/* Left Side - Form */}
        <div className="flex flex-col flex-1 items-center justify-center px-12 py-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-28 h-28 rounded-full bg-[var(--color-primary)] flex items-center justify-center mb-4">
              <Image
                src="/logos/Dark-noText.svg"
                alt="Slotify Logo"
                width={80}
                height={80}
              />
            </div>
            <span className="text-xs font-semibold tracking-widest text-[var(--color-primary)]">
              SLOTIFY
            </span>
          </div>
          {/* Welcome Text */}
          <div className="mb-6 text-center">
            <p className="text-base text-gray-700">
              Welcome back! Please sign in to your account
            </p>
          </div>
          {/* Form */}
          <form className="w-full max-w-md flex flex-col gap-4">
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              required
            />
            <Input
              label="Password"
              placeholder="Enter your Password"
              type="password"
              required
            />
            <Button type="submit">Sign In</Button>
          </form>
          {/* Divider */}
          <Divider>Or continue with</Divider>
          {/* Google Button */}
          <button className="w-full max-w-md border border-[var(--color-primary)] rounded-lg px-4 py-2 flex items-center justify-center font-bold text-[var(--color-primary)] text-base mb-2">
            <span className="mr-2 text-lg">G</span>
          </button>
          {/* Options Row */}
          <div className="w-full max-w-md flex items-center justify-between mt-2 mb-4">
            <Checkbox label="Remember me" />
            <a href="#" className="text-sm text-gray-500 hover:underline">
              Forgot password?
            </a>
          </div>
          {/* Sign up link */}
          <div className="w-full max-w-md text-center mt-2">
            <span className="text-sm text-gray-700">
              Don't have an account?{" "}
              <a href="#" className="font-bold text-black hover:underline">
                Sign up
              </a>
            </span>
          </div>
        </div>
        {/* Right Side - Illustration */}
        <div className="flex flex-col flex-1 items-center justify-center bg-[var(--color-primary)] text-white p-12">
          <Image
            src="/icons/calender.svg"
            alt="Calendar Icon"
            width={120}
            height={120}
            className="mb-8"
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
}
