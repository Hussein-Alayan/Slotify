"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export function LandingHeader() {
  const router = useRouter();
  return (
    <header className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image
              src="/logos/Dark-noText.svg"
              alt="Slotify Logo"
              width={40}
              height={40}
              className="w-10 h-10"
              priority
            />
            <span className="text-xl font-semibold text-foreground">
              Slotify
            </span>
          </div>

          {/* Navigation removed */}

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/auth/signin")}
            >
              Sign In
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
