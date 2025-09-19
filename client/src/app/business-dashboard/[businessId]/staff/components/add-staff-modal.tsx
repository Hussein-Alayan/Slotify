"use client";

import React, { useState, useEffect, useMemo } from "react";
import { fetchServices } from "@/lib/servicesAPI";
import { createStaff, updateStaff, Staff } from "@/lib/staffAPI";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// ...existing code...
import { Checkbox } from "@/components/ui/checkbox";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: number;
  staff?: Staff; // Optional: if provided, modal is in edit mode
  onStaffUpdated?: () => void; // Callback to refresh staff list
}

// Simple, readable availability shape
type DayAvailability = {
  checked: boolean;
  start: string; // "HH:MM"
  end: string; // "HH:MM"
};

export function AddStaffModal({
  isOpen,
  onClose,
  businessId,
  staff,
  onStaffUpdated,
}: AddStaffModalProps) {
  const isEditMode = !!staff;
  const weekDays = useMemo(
    () => [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    []
  );

  // Form state (simple and explicit)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    special_skills: "",
  });

  // Availability state per day
  const [availabilityState, setAvailabilityState] = useState<
    Record<string, DayAvailability>
  >(
    weekDays.reduce((acc, day) => {
      acc[day] = { checked: false, start: "09:00", end: "17:00" };
      return acc;
    }, {} as Record<string, DayAvailability>)
  );

  // Hooks must always run in the same order -> place before any early return
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen && businessId) {
      fetchServices(businessId).then((res) => {
        let items: { id: number; name: string }[] = [];
        if (
          res &&
          typeof res === "object" &&
          "data" in res &&
          Array.isArray((res as { data?: unknown }).data)
        ) {
          items = (res as { data: { id: number; name: string }[] }).data;
        } else if (Array.isArray(res)) {
          items = res as { id: number; name: string }[];
        }
        setServices(items);
      });

      // Pre-fill form if editing
      if (isEditMode && staff) {
        setFormData({
          name: staff.name || "",
          role: staff.role || "",
          special_skills: staff.special_skills || "",
        });

        // Pre-fill availability
        const newAvailability: Record<string, DayAvailability> = {};
        weekDays.forEach((day) => {
          const dayKey = day.toLowerCase().substring(0, 3);
          const staffDay =
            staff.availability?.[dayKey] || staff.availability?.[day];

          if (staffDay && !staffDay.closed) {
            newAvailability[day] = {
              checked: true,
              start: staffDay.start,
              end: staffDay.end,
            };
          } else {
            newAvailability[day] = {
              checked: false,
              start: "09:00",
              end: "17:00",
            };
          }
        });
        setAvailabilityState(newAvailability);

        // Pre-fill selected services
        if (staff.services) {
          setSelectedServiceIds(staff.services.map((s) => s.id));
        }
      } else {
        // Reset form for create mode
        setFormData({ name: "", role: "", special_skills: "" });
        setAvailabilityState(
          weekDays.reduce((acc, day) => {
            acc[day] = { checked: false, start: "09:00", end: "17:00" };
            return acc;
          }, {} as Record<string, DayAvailability>)
        );
        setSelectedServiceIds([]);
      }
    }
  }, [isOpen, businessId, isEditMode, staff, weekDays]);

  // Don't render when modal is closed (hooks already declared)
  if (!isOpen) return null;
  if (!businessId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 relative overflow-y-auto max-h-[80vh]">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Add New Staff Member
          </h2>
          <div className="text-red-600">
            Business ID not found. Please select a business.
          </div>
          <button
            className="mt-4 px-6 py-2 rounded-lg border font-semibold text-gray-900 bg-white hover:bg-gray-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Build the payload that your backend expects
  const buildPayload = () => {
    const availability: Record<string, [string, string]> = {};
    Object.entries(availabilityState).forEach(
      ([day, { checked, start, end }]) => {
        if (checked) availability[day] = [start, end];
      }
    );

    return {
      name: formData.name,
      role: formData.role,
      special_skills: formData.special_skills || "",
      availability,
      type: "staff",
      business_id: businessId,
      service_ids: selectedServiceIds,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = buildPayload();

    try {
      if (isEditMode && staff) {
        await updateStaff(businessId, staff.id, payload);
        onStaffUpdated?.(); // Refresh staff list
      } else {
        await createStaff(businessId, payload);
      }
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setError(
          (err as { message?: string }).message ||
            `Failed to ${isEditMode ? "update" : "add"} staff member.`
        );
      } else {
        setError(`Failed to ${isEditMode ? "update" : "add"} staff member.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10"
      role="dialog"
      aria-modal="true"
      aria-label="Add new staff member"
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 relative overflow-y-auto max-h-[80vh]">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {isEditMode ? "Edit Staff Member" : "Add New Staff Member"}
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  placeholder="Enter role (e.g. Hairdresser, Doctor)"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Service Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Assign Services</h3>
            <div>
              <Label className="mb-2 block text-gray-700 font-medium">
                Services
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {services.length === 0 ? (
                  <div className="text-gray-500 col-span-2">
                    No services available.
                  </div>
                ) : (
                  services.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border hover:border-slate-400 transition cursor-pointer shadow-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServiceIds.includes(service.id)}
                        onChange={(e) => {
                          setSelectedServiceIds((prev) =>
                            e.target.checked
                              ? [...prev, service.id]
                              : prev.filter((id) => id !== service.id)
                          );
                        }}
                        className="accent-slate-900 w-4 h-4"
                      />
                      <span className="text-gray-900 font-medium">
                        {service.name}
                      </span>
                    </label>
                  ))
                )}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Select one or more services for this staff member.
              </div>
            </div>
          </div>

          {/* Weekly Availability */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Weekly Availability</h3>
            <div className="space-y-3">
              {weekDays.map((day) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={availabilityState[day].checked}
                      onCheckedChange={(checked) =>
                        setAvailabilityState((prev) => ({
                          ...prev,
                          [day]: { ...prev[day], checked: checked as boolean },
                        }))
                      }
                    />
                    <Label htmlFor={day} className="w-20">
                      {day}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      type="time"
                      className="w-32"
                      value={availabilityState[day].start}
                      onChange={(e) =>
                        setAvailabilityState((prev) => ({
                          ...prev,
                          [day]: { ...prev[day], start: e.target.value },
                        }))
                      }
                    />

                    <span className="text-gray-500">to</span>

                    <Input
                      type="time"
                      className="w-32"
                      value={availabilityState[day].end}
                      onChange={(e) =>
                        setAvailabilityState((prev) => ({
                          ...prev,
                          [day]: { ...prev[day], end: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              className="px-6 py-2 rounded-lg border font-semibold text-gray-900 bg-white hover:bg-gray-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-semibold text-white bg-slate-900 hover:bg-slate-800"
              disabled={loading}
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                ? "Save Changes"
                : "Add Staff Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
