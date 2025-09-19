"use client";

import React, { useState } from "react";
import { createStaff } from "@/lib/staffAPI";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: number;
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
}: AddStaffModalProps) {
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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

  // Don't render when modal is closed (hooks already declared)
  if (!isOpen) return null;

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
      special_skills: formData.special_skills,
      availability,
      type: "staff",
      business_id: businessId,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = buildPayload();
    try {
      await createStaff(businessId, payload);
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setError(
          (err as { message?: string }).message || "Failed to add staff member."
        );
      } else {
        setError("Failed to add staff member.");
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
          Add New Staff Member
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

          {/* Skills & Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Skills & Services</h3>
            <div>
              <Label htmlFor="special_skills">
                Skills/Services They Can Provide
              </Label>
              <Textarea
                id="special_skills"
                value={formData.special_skills}
                onChange={(e) =>
                  setFormData({ ...formData, special_skills: e.target.value })
                }
                placeholder="List the services this staff member can provide"
                rows={3}
                className="mt-1"
              />
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
              {loading ? "Adding..." : "Add Staff Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
