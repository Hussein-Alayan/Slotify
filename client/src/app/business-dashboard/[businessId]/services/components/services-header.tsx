"use client";

import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";

export function ServicesHeader({ onAddService }: { onAddService: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
        <p className="text-gray-600 mt-1">
          Manage your business services and offerings
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          className="bg-slate-900 hover:bg-slate-800 text-white"
          onClick={onAddService}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
        <Button variant="outline">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="outline">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
