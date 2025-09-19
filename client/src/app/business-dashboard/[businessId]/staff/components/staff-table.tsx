"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, UserX } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useBusinessContext } from "@/contexts/BusinessContext";
import { getStaff, Staff } from "@/lib/staffAPI";

export default function StaffTable() {
  const [staffData, setStaffData] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useBusinessContext();

  useEffect(() => {
    async function fetchStaff() {
      setLoading(true);
      setError(null);
      try {
        const staff = await getStaff(businessId);
        setStaffData(staff);
      } catch {
        setError("Failed to load staff data.");
      } finally {
        setLoading(false);
      }
    }
    if (businessId) fetchStaff();
  }, [businessId]);

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        {loading && <div className="mb-4">Loading staff...</div>}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
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
