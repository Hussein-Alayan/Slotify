import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

export type BusinessData = {
  businessName: string;
  industry: string;
  contactEmail: string;
  contactPhone: string;
  businessAddress: string;
  brandVoice: string;
  timezone: string;
};

export type WorkingHour = {
  start: string;
  end: string;
  closed: boolean;
};

export type WorkingHours = {
  [key: string]: WorkingHour;
};

export type DayOfWeek = {
  key: string;
  label: string;
};

interface BusinessProfileFormProps {
  businessData: BusinessData;
  workingHours: WorkingHours;
  daysOfWeek: DayOfWeek[];
  handleInputChange: (field: keyof BusinessData, value: string) => void;
  handleWorkingHoursChange: (
    dayKey: string,
    field: keyof WorkingHour,
    value: string | boolean
  ) => void;
}

export function BusinessProfileForm({
  businessData,
  workingHours,
  daysOfWeek,
  handleInputChange,
  handleWorkingHoursChange,
}: BusinessProfileFormProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-6 w-6 text-slate-900" />
        <div>
          <h2 className="text-xl font-semibold">Business Profile</h2>
          <p className="text-gray-600">
            Tell us about your business and setup basic information
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            placeholder="Enter your business name"
            value={businessData.businessName}
            onChange={(e) => handleInputChange("businessName", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Select
            value={businessData.industry}
            onValueChange={(value) => handleInputChange("industry", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salon">Hair Salon</SelectItem>
              <SelectItem value="barbershop">Barbershop</SelectItem>
              <SelectItem value="spa">Spa & Wellness</SelectItem>
              <SelectItem value="fitness">Fitness</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="clinic">Medical Clinic</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            placeholder="business@example.com"
            value={businessData.contactEmail}
            onChange={(e) => handleInputChange("contactEmail", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="contactPhone">Contact Phone</Label>
          <Input
            id="contactPhone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={businessData.contactPhone}
            onChange={(e) => handleInputChange("contactPhone", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      <div className="mb-6">
        <Label htmlFor="businessAddress">Business Address</Label>
        <Textarea
          id="businessAddress"
          placeholder="Enter your complete business address"
          value={businessData.businessAddress}
          onChange={(e) => handleInputChange("businessAddress", e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <Label htmlFor="brandVoice">Brand Voice / Tone</Label>
          <Select
            value={businessData.brandVoice}
            onValueChange={(value) => handleInputChange("brandVoice", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select brand voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="playful">Playful</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="timezone">Timezone</Label>
          <Select
            value={businessData.timezone}
            onValueChange={(value) => handleInputChange("timezone", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="est">Eastern Time (EST)</SelectItem>
              <SelectItem value="cst">Central Time (CST)</SelectItem>
              <SelectItem value="mst">Mountain Time (MST)</SelectItem>
              <SelectItem value="pst">Pacific Time (PST)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-slate-900" />
          <Label className="text-base font-medium">Working Hours</Label>
        </div>
        <div className="space-y-4">
          {daysOfWeek.map((day) => (
            <div key={day.key} className="grid grid-cols-4 gap-4 items-center">
              <div className="font-medium text-gray-700">{day.label}</div>
              {workingHours[day.key].closed ? (
                <div className="col-span-2 text-gray-500">Closed</div>
              ) : (
                <>
                  <Input
                    type="time"
                    value={workingHours[day.key].start}
                    onChange={(e) =>
                      handleWorkingHoursChange(day.key, "start", e.target.value)
                    }
                  />
                  <Input
                    type="time"
                    value={workingHours[day.key].end}
                    onChange={(e) =>
                      handleWorkingHoursChange(day.key, "end", e.target.value)
                    }
                  />
                </>
              )}
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={workingHours[day.key].closed}
                  onCheckedChange={(checked) =>
                    handleWorkingHoursChange(day.key, "closed", checked)
                  }
                />
                <span className="text-sm text-gray-600">Closed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
