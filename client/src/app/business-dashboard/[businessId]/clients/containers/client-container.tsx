"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ClientFilters } from "../components/client-filters";
import { ClientList } from "../components/client-list";
import AddClientModal from "../components/add-client-modal";

export function ClientContainer() {
  const params = useParams();
  const businessId = Number(params.businessId);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("all-time");

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
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
          <Button onClick={() => setIsAddClientModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="w-full">
        <ClientFilters
          searchQuery={searchInput}
          setSearchQuery={setSearchInput}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <ClientList
          businessId={businessId}
          searchQuery={searchQuery}
          dateRange={dateRange}
        />
      </div>

      <AddClientModal
        open={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        businessId={businessId}
      />
    </div>
  );
}
import { Plus, Download } from "lucide-react";
