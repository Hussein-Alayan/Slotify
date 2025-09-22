"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  CheckCircle,
  UserCheck,
  UserX,
  AlertTriangle,
} from "lucide-react";
import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { useBusinessContext } from "@/contexts/BusinessContext";
import {
  getStaff,
  Staff,
  markStaffAbsent,
  markStaffPresent,
  AbsenceData,
  AbsenceResult,
} from "@/lib/staffAPI";

// Types for absence management (imported from staffAPI)

// Mark Absent Modal Component
interface MarkAbsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  businessId: number;
  onAbsenceMarked: () => void;
}

function MarkAbsentModal({
  isOpen,
  onClose,
  staff,
  businessId,
  onAbsenceMarked,
}: MarkAbsentModalProps) {
  const [absenceData, setAbsenceData] = useState<AbsenceData>({
    reason: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AbsenceResult | null>(null);

  if (!isOpen || !staff) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await markStaffAbsent(businessId, staff.id, absenceData);
      setResult(result);
      onAbsenceMarked();
    } catch (error) {
      console.error("Error marking staff absent:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setAbsenceData({
      reason: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        {!result ? (
          <>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mark {staff.name} as Absent
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="reason">Reason for Absence</Label>
                <Input
                  id="reason"
                  value={absenceData.reason}
                  onChange={(e) =>
                    setAbsenceData({ ...absenceData, reason: e.target.value })
                  }
                  placeholder="e.g., Sick leave, Vacation, Emergency"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={absenceData.start_date}
                    onChange={(e) =>
                      setAbsenceData({
                        ...absenceData,
                        start_date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={absenceData.end_date}
                    onChange={(e) =>
                      setAbsenceData({
                        ...absenceData,
                        end_date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Processing..."
                    : "Mark Absent & Reassign Bookings"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Absence Processing Complete
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    Staff marked as absent
                  </span>
                </div>
                <p className="text-green-700">
                  {staff.name} has been marked absent from{" "}
                  {absenceData.start_date} to {absenceData.end_date}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">
                      Affected Bookings
                    </span>
                  </div>
                  <p className="text-blue-700">
                    {result.affected_bookings_count} total bookings
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      Successfully Reassigned
                    </span>
                  </div>
                  <p className="text-green-700">
                    {result.successfully_reassigned.length} bookings
                  </p>
                </div>
              </div>

              {result.conflicts.length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">
                      Booking Conflicts
                    </span>
                  </div>
                  <p className="text-yellow-700 mb-3">
                    {result.conflicts.length} bookings could not be reassigned
                    automatically
                  </p>
                  <div className="space-y-2">
                    {result.conflicts.map((conflict, index) => (
                      <div
                        key={index}
                        className="text-sm text-yellow-700 bg-yellow-100 p-2 rounded"
                      >
                        <strong>{conflict.booking.service?.name}</strong> on{" "}
                        {conflict.booking.booking_date}
                        <br />
                        <span className="text-yellow-600">
                          {conflict.reason}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button onClick={handleClose}>Close</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function AbsenceManagement() {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isAbsentModalOpen, setIsAbsentModalOpen] = useState(false);
  const { businessId } = useBusinessContext();

  const {
    data: staffData = [],
    error,
    isLoading: loading,
  } = useSWR<Staff[]>(`/businesses/${businessId}/resources?type=staff`, () =>
    getStaff(businessId)
  );

  const handleMarkAbsent = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsAbsentModalOpen(true);
  };

  const handleMarkPresent = async (staff: Staff) => {
    try {
      await markStaffPresent(businessId, staff.id);
      // Refresh the staff list
      mutate(`/businesses/${businessId}/resources?type=staff`);
    } catch (error) {
      console.error("Error marking staff present:", error);
    }
  };

  const handleAbsenceMarked = () => {
    // Refresh the staff list
    mutate(`/businesses/${businessId}/resources?type=staff`);
  };

  const formatAbsencePeriod = (staff: Staff) => {
    if (!staff.absence_start) return "-";
    const start = new Date(staff.absence_start).toLocaleDateString();
    const end = staff.absence_end
      ? new Date(staff.absence_end).toLocaleDateString()
      : "Indefinite";
    return `${start} - ${end}`;
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Staff Absence Management
        </h2>
        <p className="text-gray-600">
          Manage staff absences and handle automatic booking reassignments.
        </p>
      </div>

      <div className="overflow-x-auto">
        {loading && <div className="mb-4">Loading staff...</div>}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            Failed to load staff data.
          </div>
        )}
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Staff Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Status
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Absence Reason
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Absence Period
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Services
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
                  <div className="font-medium text-gray-900">{staff.name}</div>
                  <div className="text-sm text-gray-500">
                    {staff.role || "Staff Member"}
                  </div>
                </td>
                <td className="py-4 px-4">
                  {staff.is_absent ? (
                    <Badge className="bg-red-100 text-red-800 border border-red-200">
                      <UserX className="h-3 w-3 mr-1" />
                      Absent
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800 border border-green-200">
                      <UserCheck className="h-3 w-3 mr-1" />
                      Present
                    </Badge>
                  )}
                </td>
                <td className="py-4 px-4 text-gray-700">
                  {staff.absence_reason || "-"}
                </td>
                <td className="py-4 px-4 text-gray-700">
                  {formatAbsencePeriod(staff)}
                </td>
                <td className="py-4 px-4">
                  {staff.services && staff.services.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {staff.services.slice(0, 2).map((service) => (
                        <Badge
                          key={service.id}
                          className="bg-slate-100 text-slate-800 border border-slate-200 text-xs"
                        >
                          {service.name}
                        </Badge>
                      ))}
                      {staff.services.length > 2 && (
                        <Badge className="bg-slate-100 text-slate-800 border border-slate-200 text-xs">
                          +{staff.services.length - 2} more
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No services</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {staff.is_absent ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkPresent(staff)}
                        className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Mark Present
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAbsent(staff)}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Mark Absent
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mark Absent Modal */}
      <MarkAbsentModal
        isOpen={isAbsentModalOpen}
        onClose={() => {
          setIsAbsentModalOpen(false);
          setSelectedStaff(null);
        }}
        staff={selectedStaff}
        businessId={businessId}
        onAbsenceMarked={handleAbsenceMarked}
      />
    </Card>
  );
}
