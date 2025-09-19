import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import React from "react";

export type Service = {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
};

type ServicesFormProps = {
  services: Service[];
  addService: () => void;
  removeService: (id: number) => void;
  updateService: (id: number, field: string, value: string | number) => void;
};

export function ServicesForm({
  services,
  addService,
  removeService,
  updateService,
}: ServicesFormProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-block bg-slate-900 p-2 rounded-full">
          <svg
            className="h-6 w-6 text-slate-900"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17v-2a4 4 0 014-4h3m0 0V7a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4h3a4 4 0 004-4v-2a4 4 0 014-4h-3z"
            />
          </svg>
        </span>
        <div>
          <h2 className="text-xl font-semibold">Services</h2>
          <p className="text-gray-600">
            Define the services you offer to your clients
          </p>
        </div>
      </div>
      <div className="space-y-6">
        {services.map((service: Service, index: number) => (
          <Card key={service.id} className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Service {index + 1}</h3>
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
                      updateService(service.id, "name", e.target.value)
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
                {/* Max Clients per Slot removed */}
              </div>
              <div className="mb-4">
                <Label>Description</Label>
                <Textarea
                  placeholder="Short description of the service"
                  value={service.description}
                  onChange={(e) =>
                    updateService(service.id, "description", e.target.value)
                  }
                  className="mt-1"
                  rows={2}
                />
              </div>
              {/* Special Rules removed */}
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
  );
}
