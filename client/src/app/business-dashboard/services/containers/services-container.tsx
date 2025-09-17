"use client";

import { ServicesHeader } from "../components/services-header";
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
  return (
    <div className="p-6">
      <ServicesHeader />
      <ServicesStats
        totalServices={totalServices}
        activeServices={activeServices}
      />
      <ServicesFilters />
      <ServicesGrid />
    </div>
  );
}
