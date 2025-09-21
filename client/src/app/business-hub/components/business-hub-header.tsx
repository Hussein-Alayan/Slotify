"use client";
import { User, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BusinessHubHeader() {
  const [userName, setUserName] = useState<string>("Guest");
  const router = useRouter();

  useEffect(() => {
    // Try to get user name from localStorage
    const storedName = localStorage.getItem("user_name");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <header className="bg-slate-800 text-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-slate-800" />
          </div>
          <h1 className="text-xl font-semibold">BusinessHub</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Welcome, {userName}!</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/landing")}
            className="text-slate-800 border-white hover:bg-white hover:text-slate-800"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Landing
          </Button>
        </div>
      </div>
    </header>
  );
}
