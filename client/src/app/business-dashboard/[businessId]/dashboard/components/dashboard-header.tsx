"use client";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export function DashboardHeader({ onAddClient }: { onAddClient: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here is what is happening with your business today.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={onAddClient}>
          <Users className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>
    </div>
  );
}
