"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchServices } from "@/store/services/servicesSlice";
import AddServiceModal from "./add-service-modal";

export function ServicesGrid({ businessId }: { businessId: number }) {
  const dispatch = useAppDispatch();
  const {
    items: services,
    loading,
    error,
  } = useAppSelector((state) => state.services);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState(null);

  React.useEffect(() => {
    dispatch(fetchServices(businessId));
  }, [dispatch, businessId]);

  function handleEdit(service: any) {
    setSelectedService(service);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setSelectedService(null);
  }

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
      <AddServiceModal
        open={modalOpen}
        onClose={handleCloseModal}
        businessId={businessId}
        service={selectedService}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {(Array.isArray(services) ? services : []).map((service) => (
          <Card
            key={service.id}
            className="bg-card text-card-foreground flex flex-col gap-0 rounded-xl border shadow-sm overflow-hidden"
          >
            <div
              style={{
                height: "160px",
                width: "100%",
                background: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                overflow: "hidden",
              }}
            >
              {service.photo_url ? (
                <img
                  src={service.photo_url}
                  alt={service.name}
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                  }}
                />
              ) : (
                <img
                  src="/placeholder.svg"
                  alt={service.name}
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                  }}
                />
              )}
            </div>
            <div data-slot="card-content" className="p-6">
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
                  <Button
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                    onClick={() => handleEdit(service)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
