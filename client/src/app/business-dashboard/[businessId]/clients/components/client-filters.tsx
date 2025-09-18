"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ClientFilters() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search clients by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select defaultValue="all-status">
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-status">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="last-30-days">
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last-30-days">Last 30 days</SelectItem>
          <SelectItem value="last-60-days">Last 60 days</SelectItem>
          <SelectItem value="last-90-days">Last 90 days</SelectItem>
        </SelectContent>
      </Select>
      <div className="text-sm text-gray-600">Sort by:</div>
      <Select defaultValue="last-activity">
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last-activity">Last Activity</SelectItem>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="bookings">Bookings</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
