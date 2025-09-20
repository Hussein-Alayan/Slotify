"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { fetchClients, Client } from "@/lib/clientsAPI";
export function ClientList({
  businessId,
  searchQuery,
  dateRange,
  sortBy,
}: {
  businessId: number;
  searchQuery: string;
  dateRange: string;
  sortBy: string;
}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClients() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchClients(businessId);
        setClients(data);
      } catch {
        setError("Failed to load clients");
      } finally {
        setLoading(false);
      }
    }
    loadClients();
  }, [businessId]);

  // Date filter logic
  const now = new Date();
  function isInRange(dateStr: string | null | undefined) {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    switch (dateRange) {
      case "day":
        return now.getTime() - date.getTime() <= 24 * 60 * 60 * 1000;
      case "week":
        return now.getTime() - date.getTime() <= 7 * 24 * 60 * 60 * 1000;
      case "month":
        return now.getTime() - date.getTime() <= 30 * 24 * 60 * 60 * 1000;
      case "all-time":
      default:
        return true;
    }
  }

  let filteredClients = clients.filter((client) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      client.name.toLowerCase().includes(q) ||
      (client.email && client.email.toLowerCase().includes(q)) ||
      client.phone.toLowerCase().includes(q);
    const matchesDate = isInRange(client.last_whatsapp_activity);
    return matchesSearch && matchesDate;
  });

  // Sorting logic
  if (sortBy === "last-activity") {
    filteredClients = filteredClients.sort((a, b) => {
      const aDate = a.last_whatsapp_activity
        ? new Date(a.last_whatsapp_activity).getTime()
        : 0;
      const bDate = b.last_whatsapp_activity
        ? new Date(b.last_whatsapp_activity).getTime()
        : 0;
      return bDate - aDate;
    });
  } else if (sortBy === "name") {
    filteredClients = filteredClients.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } else if (sortBy === "bookings") {
    filteredClients = filteredClients.sort(
      (a, b) => b.bookings.length - a.bookings.length
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="border-b px-6 py-4">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600">
              <div>Name</div>
              <div className="text-center">Phone</div>
              <div className="text-center">Email</div>
              <div className="text-center">Total Bookings</div>
            </div>
          </div>
          {loading ? (
            <div className="px-6 py-4 text-center text-gray-500">
              Loading clients...
            </div>
          ) : error ? (
            <div className="px-6 py-4 text-center text-red-500">{error}</div>
          ) : filteredClients.length === 0 ? (
            <div className="px-6 py-4 text-center text-gray-500">
              No clients found.
            </div>
          ) : (
            filteredClients.map((client) => (
              <div
                key={client.id}
                className="border-b last:border-b-0 px-6 py-4 hover:bg-gray-50"
              >
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="font-medium text-gray-900">{client.name}</div>
                  <div className="text-center text-sm text-gray-900">
                    {client.phone}
                  </div>
                  <div className="text-center text-sm text-gray-500">
                    {client.email || "-"}
                  </div>
                  <div className="text-center text-lg font-semibold">
                    {client.bookings.length}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}
