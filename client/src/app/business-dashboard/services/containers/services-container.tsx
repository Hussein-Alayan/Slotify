"use client";

import { ServicesHeader } from "../components/services-header";
import { ServicesStats } from "../components/services-stats";
import { ServicesFilters } from "../components/services-filters";
import { ServicesGrid } from "../components/services-grid";

export function ServicesContainer() {
  return (
    <div className="p-6">
      <ServicesHeader />
      <ServicesStats />
      <ServicesFilters />
      <ServicesGrid />
    </div>
  );
}
