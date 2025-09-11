"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Plus, Download } from "lucide-react";
import { ClientFilters } from "../components/client-filters";
import { ClientList } from "../components/client-list";
import { ClientStats } from "../components/client-stats";
import { ClientActivity } from "../components/client-activity";

export function ClientContainer() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Menu className="h-6 w-6 text-gray-600" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Client Management
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                247 Total Clients
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <ClientFilters />
          <ClientList />
        </div>

        {/* Sidebar */}
        <div>
          <ClientStats />
          <div className="mt-6">
            <ClientActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
