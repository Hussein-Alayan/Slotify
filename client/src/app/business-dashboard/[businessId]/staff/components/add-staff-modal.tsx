"use client";

import { useState } from "react";
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
}

export function AddStaffModal({ isOpen, onClose }: AddStaffModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    skills: "",
    resources: "",
  });

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  if (!isOpen) return null;

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

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email address"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hairdresser">Hairdresser</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="trainer">Fitness Trainer</SelectItem>
                    <SelectItem value="therapist">Massage Therapist</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Skills & Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Skills & Services</h3>
            <div>
              <Label htmlFor="skills">Skills/Services They Can Provide</Label>
              <Textarea
                id="skills"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
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
                    <Checkbox id={day} />
                    <Label htmlFor={day} className="w-20">
                      {day}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input type="time" className="w-32" defaultValue="09:00" />
                    <span className="text-gray-500">to</span>
                    <Input type="time" className="w-32" defaultValue="17:00" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linked Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Linked Resources</h3>
            <div>
              <Label htmlFor="resources">Assigned Resources</Label>
              <Input
                id="resources"
                value={formData.resources}
                onChange={(e) =>
                  setFormData({ ...formData, resources: e.target.value })
                }
                placeholder="e.g., Room 2, Laser Machine A"
                className="mt-1"
              />
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
            >
              Add Staff Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
