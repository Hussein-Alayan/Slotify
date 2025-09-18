"use client";
import { useEffect, useState } from "react";
import { fetchUserBusinesses } from "@/lib/businessAPI";
import { BusinessCard } from "./business-card";

type Business = {
  id: number;
  name: string;
  industry: string;
  status: string;
};

export function MyBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserBusinesses().then((data) => {
      // If using ApiResponse, data is the array
      setBusinesses(data as Business[]);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        My Businesses
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => {
          const allowedStatuses = ["Active", "Inactive", "Pending"] as const;
          type AllowedStatus = (typeof allowedStatuses)[number];
          const status = allowedStatuses.includes(
            (business.status.charAt(0).toUpperCase() +
              business.status.slice(1)) as AllowedStatus
          )
            ? ((business.status.charAt(0).toUpperCase() +
                business.status.slice(1)) as AllowedStatus)
            : "Pending";
          return (
            <BusinessCard
              key={business.id}
              name={business.name}
              category={business.industry}
              status={status}
            />
          );
        })}
      </div>
    </div>
  );
}
