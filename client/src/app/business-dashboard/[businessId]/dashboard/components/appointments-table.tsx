"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  fetchAppointments,
  fetchAllAppointments,
  Appointment,
} from "@/lib/appointmentsAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, Filter } from "lucide-react";

export function AppointmentsTable({ businessId }: { businessId: number }) {
  const [timeFilter, setTimeFilter] = useState("week");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Create SWR key based on timeFilter
  const swrKey =
    timeFilter === "all" || timeFilter === "week" || timeFilter === "month"
      ? [`/businesses/${businessId}/appointments/all`, businessId]
      : [`/businesses/${businessId}/appointments`, businessId, timeFilter];

  // SWR data fetching based on time filter
  const {
    data: appointments = [],
    error,
    isLoading: loading,
  } = useSWR<Appointment[]>(swrKey, () => {
    if (
      timeFilter === "all" ||
      timeFilter === "week" ||
      timeFilter === "month"
    ) {
      return fetchAllAppointments(businessId);
    } else {
      let params = {};
      if (timeFilter === "today") {
        const today = new Date().toISOString().slice(0, 10);
        params = { date: today };
      }
      return fetchAppointments(businessId, params);
    }
  });

  // Get unique services and clients for filter options
  const uniqueServices = Array.from(
    new Set(appointments.map((apt) => apt.service.name))
  );
  const uniqueClients = Array.from(
    new Set(appointments.map((apt) => apt.client.name))
  );

  // Filter appointments based on selected filters
  const filteredAppointments = appointments.filter((appointment) => {
    const serviceMatch =
      serviceFilter === "all" || appointment.service.name === serviceFilter;
    const clientMatch =
      clientFilter === "all" || appointment.client.name === clientFilter;

    // Time filter logic (frontend for week/month/all)
    let timeMatch = true;
    const appointmentDate = new Date(appointment.start_time);
    const now = new Date();
    if (timeFilter === "week") {
      // Get Monday of current week
      const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(now);
      monday.setDate(now.getDate() + mondayOffset);
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      timeMatch = appointmentDate >= monday && appointmentDate <= sunday;
    } else if (timeFilter === "month") {
      // Get first and last day of current month
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      lastDay.setHours(23, 59, 59, 999);
      timeMatch = appointmentDate >= firstDay && appointmentDate <= lastDay;
    } else if (timeFilter === "today") {
      timeMatch = appointmentDate.toDateString() === now.toDateString();
    } // 'all' returns all

    return serviceMatch && clientMatch && timeMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5" />
            Appointments
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filters</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Current Week</SelectItem>
              <SelectItem value="month">Current Month</SelectItem>
            </SelectContent>
          </Select>

          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {uniqueServices.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {uniqueClients.map((client) => (
                <SelectItem key={client} value={client}>
                  {client}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading appointments...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Failed to fetch appointments
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No appointments found for the selected filters.
              </div>
            ) : (
              paginatedAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {formatDate(appointment.start_time)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(appointment.start_time)} -{" "}
                        {formatTime(appointment.end_time)}
                      </div>
                    </div>

                    <div className="h-8 w-px bg-border" />

                    <div>
                      <div className="font-medium">
                        {appointment.client.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.client.phone}
                      </div>
                    </div>

                    <div className="h-8 w-px bg-border" />

                    <div>
                      <div className="font-medium">
                        {appointment.service.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${appointment.service.price}
                      </div>
                    </div>
                  </div>

                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </Badge>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredAppointments.length)}{" "}
              of {filteredAppointments.length} appointments
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
