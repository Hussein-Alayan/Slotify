"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, UserX, UserCheck } from "lucide-react";
import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { useBusinessContext } from "@/contexts/BusinessContext";
import { getStaff, deleteStaff, Staff } from "@/lib/staffAPI";
import { AddStaffModal } from "./add-staff-modal";

// Delete Confirmation Modal Component
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  staffName: string;
  isDeleting: boolean;
}

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  staffName,
  isDeleting,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Delete Staff Member
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-medium">{staffName}</span>? This action cannot
          be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StaffTable() {
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { businessId } = useBusinessContext();

  const {
    data: staffData = [],
    error,
    isLoading: loading,
  } = useSWR<Staff[]>(`/businesses/${businessId}/resources?type=staff`, () =>
    getStaff(businessId)
  );

  const handleEditClick = (staff: Staff) => {
    setEditingStaff(staff);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingStaff(null);
  };

  const handleStaffUpdated = () => {
    // Refresh the staff list using SWR mutate
    mutate(`/businesses/${businessId}/resources?type=staff`);
  };

  const handleDeleteClick = (staff: Staff) => {
    setDeletingStaff(staff);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeletingStaff(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStaff) return;

    setIsDeleting(true);
    try {
      await deleteStaff(businessId, deletingStaff.id);
      handleDeleteModalClose();
      // Refresh the staff list using SWR mutate
      mutate(`/businesses/${businessId}/resources?type=staff`);
    } catch (error) {
      console.error("Failed to delete staff:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="p-6">
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
                Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Role
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Status
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Availability
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
                </td>
                <td className="py-4 px-4 text-gray-700">{staff.role || "-"}</td>
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
                  {/* Compact availability: group consecutive days with same hours */}
                  {(() => {
                    const daysOrder = [
                      "mon",
                      "tue",
                      "wed",
                      "thu",
                      "fri",
                      "sat",
                      "sun",
                    ];
                    const dayLabels = {
                      mon: "Mon",
                      tue: "Tue",
                      wed: "Wed",
                      thu: "Thu",
                      fri: "Fri",
                      sat: "Sat",
                      sun: "Sun",
                    };

                    // Normalize availability keys to support both "mon" and "Monday" formats
                    const normalizedAvailability: Record<
                      string,
                      { start: string; end: string; closed: boolean }
                    > = {};
                    Object.entries(staff.availability || {}).forEach(
                      ([key, value]) => {
                        const normalizedKey = key.toLowerCase().substring(0, 3);
                        normalizedAvailability[normalizedKey] = value;
                      }
                    );

                    // Filter open days and map to {day, start, end}
                    const openDays = daysOrder
                      .filter(
                        (d) =>
                          normalizedAvailability[d] &&
                          !normalizedAvailability[d].closed
                      )
                      .map((d) => ({
                        day: d,
                        start: normalizedAvailability[d].start,
                        end: normalizedAvailability[d].end,
                      }));
                    if (openDays.length === 0)
                      return <span className="text-gray-400">Unavailable</span>;

                    // Group consecutive days with same hours
                    const groups = [];
                    let group = [openDays[0]];
                    for (let i = 1; i < openDays.length; i++) {
                      const prev = group[group.length - 1];
                      const curr = openDays[i];
                      if (prev.start === curr.start && prev.end === curr.end) {
                        group.push(curr);
                      } else {
                        groups.push(group);
                        group = [curr];
                      }
                    }
                    groups.push(group);

                    // Format each group
                    return groups
                      .map((g) => {
                        if (g.length === 1) {
                          return `${
                            dayLabels[g[0].day as keyof typeof dayLabels]
                          } ${g[0].start}-${g[0].end}`;
                        } else {
                          return `${
                            dayLabels[g[0].day as keyof typeof dayLabels]
                          }-${
                            dayLabels[
                              g[g.length - 1].day as keyof typeof dayLabels
                            ]
                          } ${g[0].start}-${g[0].end}`;
                        }
                      })
                      .join(", ");
                  })()}
                </td>
                <td className="py-4 px-4">
                  {staff.services && staff.services.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {staff.services.map((service) => (
                        <Badge
                          key={service.id}
                          className="bg-slate-100 text-slate-800 border border-slate-200"
                        >
                          {service.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">No services</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(staff)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteClick(staff)}
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

      {/* Edit Staff Modal */}
      <AddStaffModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        businessId={businessId}
        staff={editingStaff || undefined}
        onStaffUpdated={handleStaffUpdated}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        staffName={deletingStaff?.name || ""}
        isDeleting={isDeleting}
      />
    </Card>
  );
}
