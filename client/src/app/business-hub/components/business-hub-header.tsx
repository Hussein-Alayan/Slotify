"use client";
import { User } from "lucide-react";
import { useEffect, useState } from "react";

export function BusinessHubHeader() {
  const [userName, setUserName] = useState<string>("Guest");

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

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Welcome, {userName}!</span>
        </div>
      </div>
    </header>
  );
}
