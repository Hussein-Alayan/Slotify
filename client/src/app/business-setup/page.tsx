import React, { useState } from "react";
import Input from "@/components/shared/Input";
import Button from "@/components/Button";

const industries = [
  "IT",
  "Healthcare",
  "Education",
  "Retail",
  "Finance",
  "Other",
];
const timezones = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Asia/Dubai",
  "Asia/Tokyo",
];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const defaultWorkingHours = [
  { open: "09:00", close: "17:00", closed: false },
  { open: "09:00", close: "17:00", closed: false },
  { open: "09:00", close: "17:00", closed: false },
  { open: "09:00", close: "17:00", closed: false },
  { open: "09:00", close: "17:00", closed: false },
  { open: "09:00", close: "15:00", closed: false },
  { open: "", close: "", closed: true },
];

const BusinessSetupPage = () => {
  const [form, setForm] = useState({
    name: "",
    industry: "",
    address: "",
    email: "",
    timezone: "",
    workingHours: defaultWorkingHours,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleWorkingHourChange =
    (idx: number, field: "open" | "close") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => {
        const wh = [...prev.workingHours];
        wh[idx][field] = value;
        return { ...prev, workingHours: wh };
      });
    };

  const handleClosedToggle = (idx: number) => () => {
    setForm((prev) => {
      const wh = [...prev.workingHours];
      wh[idx].closed = !wh[idx].closed;
      if (wh[idx].closed) {
        wh[idx].open = "";
        wh[idx].close = "";
      } else {
        wh[idx].open = "09:00";
        wh[idx].close = idx === 5 ? "15:00" : "17:00";
      }
      return { ...prev, workingHours: wh };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to submit form
    alert("Business profile submitted! (API integration pending)");
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Business Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Business Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your business name"
            required
          />
          <div>
            <label className="block text-sm font-medium mb-2">Industry</label>
            <select
              name="industry"
              value={form.industry}
              onChange={handleChange}
              className="slotify-input"
              required
            >
              <option value="">Select industry</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Input
          label="Business Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Enter your complete business address"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Contact Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="business@example.com"
            type="email"
            required
          />
          <div>
            <label className="block text-sm font-medium mb-2">Timezone</label>
            <select
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              className="slotify-input"
              required
            >
              <option value="">Select timezone</option>
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Working Hours
          </label>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {days.map((day, idx) => (
              <div key={day} className="flex flex-col items-center">
                <span className="text-xs font-semibold mb-1">{day}</span>
                <Input
                  type="time"
                  value={form.workingHours[idx].open}
                  onChange={handleWorkingHourChange(idx, "open")}
                  disabled={form.workingHours[idx].closed}
                  className="mb-1"
                />
                <Input
                  type="time"
                  value={form.workingHours[idx].close}
                  onChange={handleWorkingHourChange(idx, "close")}
                  disabled={form.workingHours[idx].closed}
                  className="mb-1"
                />
                <button
                  type="button"
                  onClick={handleClosedToggle(idx)}
                  className="text-xs px-2 py-1 rounded border mt-1"
                  style={{
                    background: form.workingHours[idx].closed ? "#eee" : "#fff",
                  }}
                >
                  {form.workingHours[idx].closed ? "Closed" : "Open"}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" style={{ maxWidth: 120 }}>
            Back
          </Button>
          <Button type="submit" style={{ maxWidth: 120 }}>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BusinessSetupPage;
