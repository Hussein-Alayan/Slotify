"use client";

import React, { useState } from "react";
import Input from "@/components/shared/Input";
import Button from "@/components/Button";
import styles from "./page.module.css";
import Stepper from "./components/Stepper";
import WorkingHoursForm from "./components/WorkingHoursForm";

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
  const steps = [
    { label: "Business Profile", icon: "\u{1F4C4}" },
    { label: "Services & Resources", icon: "\u{1F4CB}" },
    { label: "Booking Rules", icon: "\u{2692}" },
    { label: "Communication", icon: "\u{1F4E7}" },
    { label: "AI Workflow", icon: "\u{1F916}" },
    { label: "Analytics", icon: "\u{1F4CA}" },
  ];
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

  const currentStep = 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle form submission
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Setup Steps</div>
        <nav className={styles.sidebarSteps}>
          {steps.map((step, idx) => (
            <div
              key={step.label}
              className={
                styles.sidebarStep +
                " " +
                (idx === currentStep
                  ? styles.sidebarStepActive
                  : styles.sidebarStepInactive)
              }
            >
              {/* You can replace with SVG icons if desired */}
              <span>{step.icon}</span>
              {step.label}
            </div>
          ))}
        </nav>
      </aside>

      <main className={styles.main}>
        {/* Stepper */}
        <div className={styles.stepper}>
          {steps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className={styles.step}>
                <div
                  className={
                    styles.stepCircle +
                    (idx === currentStep ? " " + styles.stepCircleActive : "")
                  }
                >
                  {idx + 1}
                </div>
                <div className={styles.stepLabel}>
                  {step.label.split(" ")[0]}
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className={styles.stepConnector} />
              )}
            </React.Fragment>
          ))}
          <div
            style={{
              marginLeft: "auto",
              color: "#7a8ca3",
              fontSize: "0.95rem",
            }}
          >
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Form Card */}
        <div className={styles.formCard}>
          <div className={styles.formTitle}>
            <span role="img" aria-label="profile">
              📄
            </span>
            Business Profile
          </div>
          <div className={styles.formSubtitle}>
            Tell us about your business and setup basic information
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles.grid2}>
              <Input
                label="Business Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your business name"
                required
              />
              <div>
                <label className="block text-sm font-medium mb-2">
                  Industry
                </label>
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
            <div className={styles.grid1} style={{ marginTop: 24 }}>
              <Input
                label="Business Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your complete business address"
                required
              />
            </div>
            <div className={styles.grid2} style={{ marginTop: 24 }}>
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
                <label className="block text-sm font-medium mb-2">
                  Timezone
                </label>
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
            <div style={{ marginTop: 24 }}>
              <label className={styles.workingLabel}>Working Hours</label>
              <div className={styles.workingHours}>
                {days.map((day, idx) => (
                  <div
                    key={day}
                    className={
                      styles.workingDay +
                      (form.workingHours[idx].closed
                        ? " " + styles.workingDayClosed
                        : "")
                    }
                  >
                    <span className={styles.workingLabel}>{day}</span>
                    <Input
                      type="time"
                      value={form.workingHours[idx].open}
                      onChange={handleWorkingHourChange(idx, "open")}
                      disabled={form.workingHours[idx].closed}
                      className={styles.workingInput}
                    />
                    <Input
                      type="time"
                      value={form.workingHours[idx].close}
                      onChange={handleWorkingHourChange(idx, "close")}
                      disabled={form.workingHours[idx].closed}
                      className={styles.workingInput}
                    />
                    <button
                      type="button"
                      onClick={handleClosedToggle(idx)}
                      className={
                        styles.closedBtn +
                        (form.workingHours[idx].closed
                          ? " " + styles.closedBtnActive
                          : "")
                      }
                    >
                      {form.workingHours[idx].closed ? "Closed" : "Open"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.actions}>
              <button type="button" className={styles.backBtn}>
                &#8592; Back
              </button>
              <button type="submit" className={styles.nextBtn}>
                Next &#8594;
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default BusinessSetupPage;
