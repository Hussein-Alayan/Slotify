"use client";

import { ServicesHeader } from "../components/services-header";
import React from "react";
import AddServiceModal from "../components/add-service-modal";
import { ServicesStats } from "../components/services-stats";
import { ServicesFilters } from "../components/services-filters";
import { ServicesGrid } from "../components/services-grid";

export function ServicesContainer({
  totalServices,
  activeServices,
}: {
  totalServices: number;
  activeServices: number;
}) {
  const [modalOpen, setModalOpen] = React.useState(false);
  // TODO: Replace with actual businessId from context or props
  const businessId = 3;

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
