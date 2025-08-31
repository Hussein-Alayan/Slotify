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
              <Card>
                <CardContent className="p-8">
                  {/* Step 1: Business Profile */}
                  {currentStep === 1 && (
                    <BusinessProfileForm
                      businessData={businessData}
                      workingHours={workingHours}
                      daysOfWeek={daysOfWeek}
                      handleInputChange={handleInputChange}
                      handleWorkingHoursChange={handleWorkingHoursChange}
                    />
                  )}
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
                              <SelectItem value="spa">
                                Spa & Wellness
                              </SelectItem>
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
                        <Label htmlFor="businessAddress">
                          Business Address
                        </Label>
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
                              {workingHours[day.key as DayKey].closed ? (
                                <div className="col-span-2 text-gray-500">
                                  Closed
                                </div>
                              ) : (
                                <>
                                  <Input
                                    type="time"
                                    value={
                                      workingHours[day.key as DayKey].start
                                    }
                                    onChange={(e) =>
                                      handleWorkingHoursChange(
                                        day.key as DayKey,
                                        "start",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <Input
                                    type="time"
                                    value={workingHours[day.key as DayKey].end}
                                    onChange={(e) =>
                                      handleWorkingHoursChange(
                                        day.key as DayKey,
                                        "end",
                                        e.target.value
                                      )
                                    }
                                  />
                                </>
                              )}
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={
                                    workingHours[day.key as DayKey].closed
                                  }
                                  onCheckedChange={(checked) =>
                                    handleWorkingHoursChange(
                                      day.key as DayKey,
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
                    <ServicesForm
                      services={services}
                      addService={addService}
                      removeService={removeService}
                      updateService={updateService}
                    />
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
                                      {member.availability[day.key as DayKey]
                                        .closed ? (
                                        <div className="col-span-2 text-gray-500">
                                          Not Available
                                        </div>
                                      ) : (
                                        <>
                                          <Input
                                            type="time"
                                            value={
                                              member.availability[
                                                day.key as DayKey
                                              ].start
                                            }
                                            onChange={(e) => {
                                              const updatedAvailability = {
                                                ...member.availability,
                                                [day.key as DayKey]: {
                                                  ...member.availability[
                                                    day.key as DayKey
                                                  ],
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
                                              member.availability[
                                                day.key as DayKey
                                              ].end
                                            }
                                            onChange={(e) => {
                                              const updatedAvailability = {
                                                ...member.availability,
                                                [day.key as DayKey]: {
                                                  ...member.availability[
                                                    day.key as DayKey
                                                  ],
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
                                            member.availability[
                                              day.key as DayKey
                                            ].closed
                                          }
                                          onCheckedChange={(checked) => {
                                            const updatedAvailability = {
                                              ...member.availability,
                                              [day.key as DayKey]: {
                                                ...member.availability[
                                                  day.key as DayKey
                                                ],
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
                          <h2 className="text-xl font-semibold">
                            Booking Rules
                          </h2>
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
                                  communicationSettings.notifications
                                    .cancellation
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
                  {currentStep === setupSteps.length
                    ? "Complete Setup"
                    : "Next"}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
