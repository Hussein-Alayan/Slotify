"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Eye, UserX } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { fetchServices } from "@/store/services/servicesSlice";
import { useBusinessContext } from "@/contexts/BusinessContext";

interface Service {
  id: string | number;
  name: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  availability: string;
  status: "active" | "inactive";
  email: string;
  phone: string;
  serviceId?: string;
}

// Mock staff data
const initialStaffData: StaffMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Senior Hairdresser",
    availability: "Mon-Fri 9AM-5PM",
    status: "active",
    email: "sarah@salon.com",
    phone: "(555) 123-4567",
  },
  {
    id: "2",
    name: "Mike Chen",
    role: "Fitness Trainer",
    availability: "Mon-Sat 6AM-8PM",
    status: "active",
    email: "mike@gym.com",
    phone: "(555) 234-5678",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    role: "General Practitioner",
    availability: "Tue-Thu 8AM-6PM",
    status: "active",
    email: "emily@clinic.com",
    phone: "(555) 345-6789",
  },
  {
    id: "4",
    name: "Alex Thompson",
    role: "Massage Therapist",
    availability: "Wed-Sun 10AM-7PM",
    status: "inactive",
    email: "alex@spa.com",
    phone: "(555) 456-7890",
  },
];

export default function StaffTable() {
  const [staffData, setStaffData] = useState(initialStaffData);
  const dispatch = useAppDispatch();
  const { businessId } = useBusinessContext();

  const services = useAppSelector((state) => state.services.items);
  const error = useAppSelector((state) => state.services.error);

  // Fetch services on mount
  useEffect(() => {
    dispatch(fetchServices(businessId));
  }, [dispatch, businessId]);

  // Handle service selection for a staff member
  const handleServiceChange = (id: string, serviceId: string) => {
    setStaffData((prev) =>
      prev.map((staff) => (staff.id === id ? { ...staff, serviceId } : staff))
    );
  };

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error === "Network Error"
              ? "Unable to load services. Please check your connection."
              : error}
          </div>
        )}
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Role
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Availability
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Service
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Status
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {staffData.map((staff) => (
              <tr
                key={staff.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {staff.name}
                    </div>
                    <div className="text-sm text-gray-500">{staff.email}</div>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-700">{staff.role}</td>
                <td className="py-4 px-4 text-gray-700">
                  {staff.availability}
                </td>
                <td className="py-4 px-4">
                  <Select
                    value={staff.serviceId || ""}
                    onValueChange={(value) =>
                      handleServiceChange(staff.id, value)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service: Service) => (
                        <SelectItem
                          key={service.id}
                          value={service.id.toString()}
                        >
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-4 px-4">
                  <Badge
                    variant={
                      staff.status === "active" ? "default" : "secondary"
                    }
                    className={
                      staff.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {staff.status}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
