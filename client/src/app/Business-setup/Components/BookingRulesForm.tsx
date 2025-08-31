import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

type BookingRules = {
  leadTime: number;
  cancellationPolicy: number;
  bufferTime: number;
  maxBookingsPerClient: number;
};

interface BookingRulesFormProps {
  bookingRules: BookingRules;
  setBookingRules: (rules: BookingRules) => void;
}

export function BookingRulesForm({
  bookingRules,
  setBookingRules,
}: BookingRulesFormProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200">
          <svg
            className="h-4 w-4 text-slate-900"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
        <div>
          <h2 className="text-xl font-semibold">Booking Rules</h2>
          <p className="text-gray-600">
            Set up your booking policies and restrictions
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Lead Time (hours)</Label>
          <Input
            type="number"
            placeholder="24"
            value={bookingRules.leadTime}
            onChange={(e) =>
              setBookingRules({
                ...bookingRules,
                leadTime: Number.parseInt(e.target.value),
              })
            }
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            Minimum time before a booking can be made
          </p>
        </div>
        <div>
          <Label>Cancellation Policy (hours)</Label>
          <Input
            type="number"
            placeholder="24"
            value={bookingRules.cancellationPolicy}
            onChange={(e) =>
              setBookingRules({
                ...bookingRules,
                cancellationPolicy: Number.parseInt(e.target.value),
              })
            }
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            Time limit for cancellations
          </p>
        </div>
        <div>
          <Label>Buffer Time (minutes)</Label>
          <Input
            type="number"
            placeholder="15"
            value={bookingRules.bufferTime}
            onChange={(e) =>
              setBookingRules({
                ...bookingRules,
                bufferTime: Number.parseInt(e.target.value),
              })
            }
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            Time between appointments
          </p>
        </div>
        <div>
          <Label>Max Bookings per Client</Label>
          <Input
            type="number"
            placeholder="5"
            value={bookingRules.maxBookingsPerClient}
            onChange={(e) =>
              setBookingRules({
                ...bookingRules,
                maxBookingsPerClient: Number.parseInt(e.target.value),
              })
            }
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            Maximum active bookings per client
          </p>
        </div>
      </div>
    </div>
  );
}
