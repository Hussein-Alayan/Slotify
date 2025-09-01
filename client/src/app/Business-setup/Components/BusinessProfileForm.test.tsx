import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  BusinessProfileForm,
  BusinessData,
  WorkingHours,
  DayOfWeek,
} from "./BusinessProfileForm";

describe("BusinessProfileForm", () => {
  const businessData: BusinessData = {
    businessName: "",
    industry: "",
    contactEmail: "",
    contactPhone: "",
    businessAddress: "",
    brandVoice: "",
    timezone: "",
  };

  const workingHours: WorkingHours = {
    mon: { start: "09:00", end: "17:00", closed: false },
    tue: { start: "09:00", end: "17:00", closed: false },
    wed: { start: "09:00", end: "17:00", closed: false },
    thu: { start: "09:00", end: "17:00", closed: false },
    fri: { start: "09:00", end: "17:00", closed: false },
    sat: { start: "09:00", end: "17:00", closed: true },
    sun: { start: "09:00", end: "17:00", closed: true },
  };

  const daysOfWeek: DayOfWeek[] = [
    { key: "mon", label: "Monday" },
    { key: "tue", label: "Tuesday" },
    { key: "wed", label: "Wednesday" },
    { key: "thu", label: "Thursday" },
    { key: "fri", label: "Friday" },
    { key: "sat", label: "Saturday" },
    { key: "sun", label: "Sunday" },
  ];

  it("renders all main input fields", () => {
    render(
      <BusinessProfileForm
        businessData={businessData}
        workingHours={workingHours}
        daysOfWeek={daysOfWeek}
        handleInputChange={jest.fn()}
        handleWorkingHoursChange={jest.fn()}
      />
    );
    expect(screen.getByLabelText(/Business Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Industry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Business Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Brand Voice/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Timezone/i)).toBeInTheDocument();
  });

  it("calls handleInputChange when business name is changed", () => {
    const handleInputChange = jest.fn();
    render(
      <BusinessProfileForm
        businessData={businessData}
        workingHours={workingHours}
        daysOfWeek={daysOfWeek}
        handleInputChange={handleInputChange}
        handleWorkingHoursChange={jest.fn()}
      />
    );
    const input = screen.getByPlaceholderText(/enter your business name/i);
    fireEvent.change(input, { target: { value: "Test Name" } });
    expect(handleInputChange).toHaveBeenCalledWith("businessName", "Test Name");
  });
});
