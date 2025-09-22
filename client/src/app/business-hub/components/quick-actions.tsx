"use client";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function QuickActions() {
  const router = useRouter();
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Quick Actions
      </h3>

      <Card
        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => router.push("/business-setup")}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">
              Create New Business
            </h4>
            <p className="text-sm text-gray-600">
              Set up a new business profile and start managing
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
