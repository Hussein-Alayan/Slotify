"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  Briefcase,
  Settings,
  MessageSquare,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const setupSteps = [
  { id: 1, name: "Business", icon: Building2, description: "Business Profile" },
  {
    id: 2,
    name: "Services",
    icon: Briefcase,
    description: "Services & Resources",
  },
  { id: 3, name: "Staff", icon: Users, description: "Resources / Staff" },
  { id: 4, name: "Rules", icon: Settings, description: "Booking Rules" },
  {
    id: 5,
    name: "Communication",
    icon: MessageSquare,
    description: "Communication / AI Settings",
  },
];

const daysOfWeek = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

const defaultWorkingHours = {
  mon: { start: "09:00", end: "17:00", closed: false },
  tue: { start: "09:00", end: "17:00", closed: false },
  wed: { start: "09:00", end: "17:00", closed: false },
  thu: { start: "09:00", end: "17:00", closed: false },
  fri: { start: "09:00", end: "17:00", closed: false },
  sat: { start: "09:00", end: "15:00", closed: false },
  sun: { start: "", end: "", closed: true },
};

export function BusinessSetup() {
  const [currentStep, setCurrentStep] = useState(1);

  const [businessData, setBusinessData] = useState({
    businessName: "",
    industry: "",
    contactEmail: "",
    contactPhone: "",
    businessAddress: "",
    brandVoice: "",
    timezone: "",
  });

  const [workingHours, setWorkingHours] = useState(defaultWorkingHours);

  const [services, setServices] = useState([
    {
      id: 1,
      name: "",
      description: "",
      duration: 30,
      price: 0,
      maxClients: 1,
      specialRules: "",
    },
  ]);

  const [staff, setStaff] = useState([
    {
      id: 1,
      name: "",
      role: "",
      availability: { ...defaultWorkingHours },
      specialSkills: "",
      maxAppointments: 10,
    },
  ]);

  const [bookingRules, setBookingRules] = useState({
    leadTime: 24,
    cancellationPolicy: 24,
    bufferTime: 15,
    maxBookingsPerClient: 5,
  });

  const [communicationSettings, setCommunicationSettings] = useState({
    whatsappApiKey: "",
    autoReplyEnabled: false,
    responseStyle: "",
    notifications: {
      newBooking: true,
      cancellation: true,
      reschedule: true,
      reminder: true,
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setBusinessData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWorkingHoursChange = (
    day: string,
    field: string,
    value: string | boolean
  ) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const addService = () => {
    const newService = {
      id: services.length + 1,
      name: "",
      description: "",
      duration: 30,
      price: 0,
      maxClients: 1,
      specialRules: "",
    };
    setServices([...services, newService]);
  };

  const removeService = (id: number) => {
    setServices(services.filter((service) => service.id !== id));
  };

  const updateService = (id: number, field: string, value: any) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const addStaff = () => {
    const newStaff = {
      id: staff.length + 1,
      name: "",
      role: "",
      availability: { ...defaultWorkingHours },
      specialSkills: "",
      maxAppointments: 10,
    };
    setStaff([...staff, newStaff]);
  };

  const removeStaff = (id: number) => {
    setStaff(staff.filter((member) => member.id !== id));
  };

  const updateStaff = (id: number, field: string, value: any) => {
    setStaff(
      staff.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const nextStep = () => {
    if (currentStep < setupSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold">Slotify</span>
          </div>
          <h1 className="text-xl font-medium">Setup your booking platform</h1>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Setup Progress</h2>
            <span className="text-sm text-gray-600">
              Step {currentStep} of {setupSteps.length}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {setupSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    currentStep === step.id
                      ? "bg-slate-900 text-white"
                      : currentStep > step.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  )}
                >
                  {step.id}
                </div>
                <span
                  className={cn(
                    "ml-2 text-sm font-medium",
                    currentStep === step.id ? "text-slate-900" : "text-gray-600"
                  )}
                >
                  {step.name}
                </span>
                {index < setupSteps.length - 1 && (
                  <div className="w-8 h-px bg-gray-300 mx-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900 text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6">Setup Steps</h3>
                <div className="space-y-4">
                  {setupSteps.map((step) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                          currentStep === step.id
                            ? "bg-blue-600"
                            : "hover:bg-slate-800"
                        )}
                        onClick={() => setCurrentStep(step.id)}
                      >
                        <Icon className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{step.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                {/* Step 1: Business Profile */}
                {currentStep === 1 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Building2 className="h-6 w-6 text-slate-900" />
                      <div>
                        <h2 className="text-xl font-semibold">
                          Business Profile
                        </h2>
                        <p className="text-gray-600">
                          Tell us about your business and setup basic
                          information
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
                          onChange={(e) =>
                            handleInputChange("businessName", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Select
                          value={businessData.industry}
                          onValueChange={(value) =>
                            handleInputChange("industry", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="salon">Hair Salon</SelectItem>
                            <SelectItem value="barbershop">
                              Barbershop
                            </SelectItem>
                            <SelectItem value="spa">Spa & Wellness</SelectItem>
                            <SelectItem value="fitness">Fitness</SelectItem>
                            <SelectItem value="healthcare">
                              Healthcare
                            </SelectItem>
                            <SelectItem value="restaurant">
                              Restaurant
                            </SelectItem>
                            <SelectItem value="clinic">
                              Medical Clinic
                            </SelectItem>
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
                          onChange={(e) =>
                            handleInputChange("contactEmail", e.target.value)
                          }
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
                          onChange={(e) =>
                            handleInputChange("contactPhone", e.target.value)
                          }
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
                        onChange={(e) =>
                          handleInputChange("businessAddress", e.target.value)
                        }
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <Label htmlFor="brandVoice">Brand Voice / Tone</Label>
                        <Select
                          value={businessData.brandVoice}
                          onValueChange={(value) =>
                            handleInputChange("brandVoice", value)
                          }
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
                          onValueChange={(value) =>
                            handleInputChange("timezone", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="est">
                              Eastern Time (EST)
                            </SelectItem>
                            <SelectItem value="cst">
                              Central Time (CST)
                            </SelectItem>
                            <SelectItem value="mst">
                              Mountain Time (MST)
                            </SelectItem>
                            <SelectItem value="pst">
                              Pacific Time (PST)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-5 w-5 text-slate-900" />
                        <Label className="text-base font-medium">
                          Working Hours
                        </Label>
                      </div>
                      <div className="space-y-4">
                        {daysOfWeek.map((day) => (
                          <div
                            key={day.key}
                            className="grid grid-cols-4 gap-4 items-center"
                          >
                            <div className="font-medium text-gray-700">
                              {day.label}
                            </div>
                            {workingHours[day.key].closed ? (
                              <div className="col-span-2 text-gray-500">
                                Closed
                              </div>
                            ) : (
                              <>
                                <Input
                                  type="time"
                                  value={workingHours[day.key].start}
                                  onChange={(e) =>
                                    handleWorkingHoursChange(
                                      day.key,
                                      "start",
                                      e.target.value
                                    )
                                  }
                                />
                                <Input
                                  type="time"
                                  value={workingHours[day.key].end}
                                  onChange={(e) =>
                                    handleWorkingHoursChange(
                                      day.key,
                                      "end",
                                      e.target.value
                                    )
                                  }
                                />
                              </>
                            )}
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={workingHours[day.key].closed}
                                onCheckedChange={(checked) =>
                                  handleWorkingHoursChange(
                                    day.key,
                                    "closed",
                                    checked
                                  )
                                }
                              />
                              <span className="text-sm text-gray-600">
                                Closed
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Services */}
                {currentStep === 2 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Briefcase className="h-6 w-6 text-slate-900" />
                      <div>
                        <h2 className="text-xl font-semibold">Services</h2>
                        <p className="text-gray-600">
                          Define the services you offer to your clients
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {services.map((service, index) => (
                        <Card key={service.id} className="border-2">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-medium">
                                Service {index + 1}
                              </h3>
                              {services.length > 1 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeService(service.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label>Service Name</Label>
                                <Input
                                  placeholder="e.g., Haircut, Consultation"
                                  value={service.name}
                                  onChange={(e) =>
                                    updateService(
                                      service.id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>Duration (minutes)</Label>
                                <Input
                                  type="number"
                                  placeholder="30"
                                  value={service.duration}
                                  onChange={(e) =>
                                    updateService(
                                      service.id,
                                      "duration",
                                      Number.parseInt(e.target.value)
                                    )
                                  }
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label>Price ($)</Label>
                                <Input
                                  type="number"
                                  placeholder="50"
                                  value={service.price}
                                  onChange={(e) =>
                                    updateService(
                                      service.id,
                                      "price",
                                      Number.parseFloat(e.target.value)
                                    )
                                  }
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>Max Clients per Slot</Label>
                                <Input
                                  type="number"
                                  placeholder="1"
                                  value={service.maxClients}
                                  onChange={(e) =>
                                    updateService(
                                      service.id,
                                      "maxClients",
                                      Number.parseInt(e.target.value)
                                    )
                                  }
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div className="mb-4">
                              <Label>Description</Label>
                              <Textarea
                                placeholder="Short description of the service"
                                value={service.description}
                                onChange={(e) =>
                                  updateService(
                                    service.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="mt-1"
                                rows={2}
                              />
                            </div>

                            <div>
                              <Label>Special Rules (Optional)</Label>
                              <Textarea
                                placeholder="e.g., Age limit, prerequisites, special requirements"
                                value={service.specialRules}
                                onChange={(e) =>
                                  updateService(
                                    service.id,
                                    "specialRules",
                                    e.target.value
                                  )
                                }
                                className="mt-1"
                                rows={2}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Button
                        onClick={addService}
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Service
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Staff */}
                {currentStep === 3 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Users className="h-6 w-6 text-slate-900" />
                      <div>
                        <h2 className="text-xl font-semibold">
                          Resources / Staff
                        </h2>
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
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeStaff(member.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label>Staff Name</Label>
                                <Input
                                  placeholder="e.g., John Smith"
                                  value={member.name}
                                  onChange={(e) =>
                                    updateStaff(
                                      member.id,
                                      "name",
                                      e.target.value
                                    )
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
                                    updateStaff(
                                      member.id,
                                      "role",
                                      e.target.value
                                    )
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
                                    updateStaff(
                                      member.id,
                                      "specialSkills",
                                      e.target.value
                                    )
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

                            {/* Availability */}
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <Clock className="h-5 w-5 text-slate-900" />
                                <Label className="text-base font-medium">
                                  Availability
                                </Label>
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
                                    {member.availability[day.key].closed ? (
                                      <div className="col-span-2 text-gray-500">
                                        Not Available
                                      </div>
                                    ) : (
                                      <>
                                        <Input
                                          type="time"
                                          value={
                                            member.availability[day.key].start
                                          }
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
                                          value={
                                            member.availability[day.key].end
                                          }
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
                                        checked={
                                          member.availability[day.key].closed
                                        }
                                        onCheckedChange={(checked) => {
                                          const updatedAvailability = {
                                            ...member.availability,
                                            [day.key]: {
                                              ...member.availability[day.key],
                                              closed: checked,
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

                      <Button
                        onClick={addStaff}
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Staff Member
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Booking Rules */}
                {currentStep === 4 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Settings className="h-6 w-6 text-slate-900" />
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
                              cancellationPolicy: Number.parseInt(
                                e.target.value
                              ),
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
                              maxBookingsPerClient: Number.parseInt(
                                e.target.value
                              ),
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
                )}

                {/* Step 5: Communication / AI Settings */}
                {currentStep === 5 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <MessageSquare className="h-6 w-6 text-slate-900" />
                      <div>
                        <h2 className="text-xl font-semibold">
                          Communication / AI Settings
                        </h2>
                        <p className="text-gray-600">
                          Configure automated messaging and notifications
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label>WhatsApp / Social API Key</Label>
                        <Input
                          type="password"
                          placeholder="Enter your API key"
                          value={communicationSettings.whatsappApiKey}
                          onChange={(e) =>
                            setCommunicationSettings({
                              ...communicationSettings,
                              whatsappApiKey: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Credentials for AI to send messages
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto-Reply Enabled</Label>
                          <p className="text-sm text-gray-500">
                            Enable automatic responses to client messages
                          </p>
                        </div>
                        <Switch
                          checked={communicationSettings.autoReplyEnabled}
                          onCheckedChange={(checked) =>
                            setCommunicationSettings({
                              ...communicationSettings,
                              autoReplyEnabled: checked,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label>Preferred Response Style</Label>
                        <Select
                          value={communicationSettings.responseStyle}
                          onValueChange={(value) =>
                            setCommunicationSettings({
                              ...communicationSettings,
                              responseStyle: value,
                            })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select response style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="playful">Playful</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-base font-medium mb-4 block">
                          Notification Settings
                        </Label>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>New Booking</span>
                            <Switch
                              checked={
                                communicationSettings.notifications.newBooking
                              }
                              onCheckedChange={(checked) =>
                                setCommunicationSettings({
                                  ...communicationSettings,
                                  notifications: {
                                    ...communicationSettings.notifications,
                                    newBooking: checked,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Cancellation</span>
                            <Switch
                              checked={
                                communicationSettings.notifications.cancellation
                              }
                              onCheckedChange={(checked) =>
                                setCommunicationSettings({
                                  ...communicationSettings,
                                  notifications: {
                                    ...communicationSettings.notifications,
                                    cancellation: checked,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Reschedule</span>
                            <Switch
                              checked={
                                communicationSettings.notifications.reschedule
                              }
                              onCheckedChange={(checked) =>
                                setCommunicationSettings({
                                  ...communicationSettings,
                                  notifications: {
                                    ...communicationSettings.notifications,
                                    reschedule: checked,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Reminder</span>
                            <Switch
                              checked={
                                communicationSettings.notifications.reminder
                              }
                              onCheckedChange={(checked) =>
                                setCommunicationSettings({
                                  ...communicationSettings,
                                  notifications: {
                                    ...communicationSettings.notifications,
                                    reminder: checked,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={
                  currentStep === setupSteps.length
                    ? () => alert("Setup Complete!")
                    : nextStep
                }
                className="bg-slate-900 hover:bg-slate-800"
              >
                {currentStep === setupSteps.length ? "Complete Setup" : "Next"}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
