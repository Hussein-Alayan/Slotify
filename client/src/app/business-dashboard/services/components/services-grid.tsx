"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { fetchServices } from "@/lib/servicesAPI";

type Service = {
  id: number;
  name: string;
  description?: string;
  price: number;
  status: string;
  image?: string;
};

export function ServicesGrid({ businessId }: { businessId: number }) {
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    fetchServices(businessId)
      .then((data: any) => {
        // If backend returns { success: true, data: [...] }, extract data.data
        if (Array.isArray(data?.data)) {
          setServices(data.data);
        } else if (Array.isArray(data)) {
          setServices(data);
        } else if (Array.isArray(data?.services)) {
          setServices(data.services);
        } else {
          setServices([]);
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        setLoading(false);
        if (typeof err === "object" && err !== null && "message" in err) {
          setError(
            (err as { message?: string }).message || "Failed to fetch services."
          );
        } else {
          setError("Failed to fetch services.");
        }
      });
  }, [businessId]);

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-600">Loading services...</div>
    );
  }
  if (error) {
    return <div className="py-12 text-center text-red-600">{error}</div>;
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-200">
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {service.name}
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  {service.status}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {service.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  ${service.price}
                </span>
                <div className="flex items-center gap-2">
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
