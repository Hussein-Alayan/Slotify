import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Clock } from "lucide-react";
import React from "react";

type DayOfWeek = { key: string; label: string };
import type { CheckedState } from "@radix-ui/react-checkbox";
type Availability = {
  start: string;
  end: string;
  closed: boolean | CheckedState;
};
export type StaffMember = {
  id: string;
  name: string;
  role: string;
  specialSkills: string;
  maxAppointments: number;
  availability: { [key: string]: Availability };
};

interface StaffFormProps {
  staff: StaffMember[];
  daysOfWeek: DayOfWeek[];
  addStaff: () => void;
  removeStaff: (id: string) => void;
  updateStaff: (
    id: string,
    field: keyof StaffMember,
    value: string | number | { [key: string]: Availability }
  ) => void;
}

export function StaffForm({
  staff,
  daysOfWeek,
  addStaff,
  removeStaff,
  updateStaff,
}: StaffFormProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-6 w-6 text-slate-900" />
        <div>
          <h2 className="text-xl font-semibold">Resources / Staff</h2>
          <p className="text-gray-600">
            Add your team members and their availability
          </p>
        </div>
      </div>
      <div className="space-y-6">
        {staff.map((member, index) => (
          <Card key={member.id} className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">
                  Staff Member {index + 1}
                </h3>
                {staff.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStaff(member.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Staff Name</Label>
                  <Input
                    placeholder="e.g., John Smith"
                    value={member.name}
                    onChange={(e) =>
                      updateStaff(member.id, "name", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Role / Position</Label>
                  <Input
                    placeholder="e.g., Stylist, Doctor, Trainer"
                    value={member.role}
                    onChange={(e) =>
                      updateStaff(member.id, "role", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label>Special Skills</Label>
                  <Textarea
                    placeholder="Services they can handle"
                    value={member.specialSkills}
                    onChange={(e) =>
                      updateStaff(member.id, "specialSkills", e.target.value)
                    }
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Max Appointments per Day</Label>
                  <Input
                    type="number"
                    placeholder="10"
                    value={member.maxAppointments}
                    onChange={(e) =>
                      updateStaff(
                        member.id,
                        "maxAppointments",
                        Number.parseInt(e.target.value)
                      )
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-slate-900" />
                  <Label className="text-base font-medium">Availability</Label>
                </div>
                <div className="space-y-3">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day.key}
                      className="grid grid-cols-4 gap-4 items-center"
                    >
                      <div className="font-medium text-gray-700">
                        {day.label}
                      </div>
                      {member.availability[day.key]?.closed ? (
                        <div className="col-span-2 text-gray-500">
                          Not Available
                        </div>
                      ) : (
                        <>
                          <Input
                            type="time"
                            value={member.availability[day.key]?.start || ""}
                            onChange={(e) => {
                              const updatedAvailability = {
                                ...member.availability,
                                [day.key]: {
                                  ...member.availability[day.key],
                                  start: e.target.value,
                                },
                              };
                              updateStaff(
                                member.id,
                                "availability",
                                updatedAvailability
                              );
                            }}
                          />
                          <Input
                            type="time"
                            value={member.availability[day.key]?.end || ""}
                            onChange={(e) => {
                              const updatedAvailability = {
                                ...member.availability,
                                [day.key]: {
                                  ...member.availability[day.key],
                                  end: e.target.value,
                                },
                              };
                              updateStaff(
                                member.id,
                                "availability",
                                updatedAvailability
                              );
                            }}
                          />
                        </>
                      )}
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={Boolean(
                            member.availability[day.key]?.closed
                          )}
                          onCheckedChange={(checked: CheckedState) => {
                            const updatedAvailability = {
                              ...member.availability,
                              [day.key]: {
                                ...member.availability[day.key],
                                closed:
                                  checked === "indeterminate" ? false : checked,
                              },
                            };
                            updateStaff(
                              member.id,
                              "availability",
                              updatedAvailability
                            );
                          }}
                        />
                        <span className="text-sm text-gray-600">
                          Not Available
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <button
          type="button"
          onClick={addStaff}
          className="w-full bg-transparent border border-gray-300 rounded-md py-2 mt-4 flex items-center justify-center gap-2 hover:bg-gray-100"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Staff Member
        </button>
      </div>
    </div>
  );
}
