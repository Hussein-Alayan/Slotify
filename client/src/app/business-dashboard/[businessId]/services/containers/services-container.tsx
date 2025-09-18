"use client";

import { ServicesHeader } from "../components/services-header";
import React from "react";
import AddServiceModal from "../components/add-service-modal";
import { ServicesStats } from "../components/services-stats";
import { ServicesFilters } from "../components/services-filters";
import { ServicesGrid } from "../components/services-grid";
import { useBusinessContext } from "@/contexts/BusinessContext";

export function ServicesContainer({
  totalServices,
  activeServices,
}: {
  totalServices: number;
  activeServices: number;
}) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const { businessId } = useBusinessContext();

  return (
    <div className="p-6">
      <ServicesHeader onAddService={() => setModalOpen(true)} />
      <ServicesStats
        totalServices={totalServices}
        activeServices={activeServices}
      />
      <ServicesFilters />
      <ServicesGrid businessId={businessId} />
      <AddServiceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        businessId={businessId}
      />
    </div>
  );
}
