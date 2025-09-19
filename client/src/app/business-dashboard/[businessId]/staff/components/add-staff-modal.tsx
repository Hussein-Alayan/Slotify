"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onClose}
            className="flex items-center gap-2 font-bold"
          >
            Add Staff Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
