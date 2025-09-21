"use client";

import { Button } from "@/components/ui/button";
import {
  Calendar,
  MessageCircle,
  BarChart3,
  MapPin,
  Bot,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Making Appointments Easier For Your Business
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Streamline your business with AI-powered Socials booking.
                Clients book instantly through chat while you manage everything
                from one dashboard.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Calendar className="w-5 h-5 mr-2" />
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/call-test")}
              >
                <Phone className="w-5 h-5 mr-2" />
                Try Voice Booking
              </Button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div className="bg-gray-50 rounded-2xl p-8 border border-border">
              <div className="relative space-y-6">
                {/* Chat Bubble */}
                <div className="animate-float">
                  <div className="bg-primary/10 rounded-lg p-4 max-w-xs">
                    <MessageCircle className="w-6 h-6 text-primary mb-2" />
                    <div className="space-y-2">
                      <div className="h-2 bg-primary/30 rounded w-3/4"></div>
                      <div className="h-2 bg-primary/30 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>

                {/* Calendar */}
                <div
                  className="animate-float"
                  style={{ animationDelay: "0.5s" }}
                >
                  <div className="bg-white rounded-lg shadow-md p-4 border border-border">
                    <Calendar className="w-6 h-6 text-primary mb-3" />
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 21 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded ${
                            i === 10 || i === 15
                              ? "bg-green-200"
                              : "bg-gray-100"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dashboard Card */}
                <div className="animate-float" style={{ animationDelay: "1s" }}>
                  <div className="bg-white rounded-lg shadow-md p-4 border border-border">
                    <BarChart3 className="w-6 h-6 text-primary mb-3" />
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                      <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>

                {/* Location Pin */}
                <div className="absolute top-4 right-4 animate-bounce">
                  <div className="bg-primary rounded-full p-2">
                    <MapPin className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>

                {/* AI Bot */}
                <div className="absolute bottom-4 right-4 animate-pulse">
                  <div className="bg-primary rounded-full p-3">
                    <Bot className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>

                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <pattern
                      id="dots"
                      x="0"
                      y="0"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle
                        cx="2"
                        cy="2"
                        r="1"
                        fill="#94a3b8"
                        opacity="0.5"
                      />
                    </pattern>
                  </defs>
                  <path
                    d="M100 50 Q200 100 300 150"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                    opacity="0.6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
