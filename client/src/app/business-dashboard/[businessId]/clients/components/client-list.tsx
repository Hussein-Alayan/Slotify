"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { fetchClients, Client } from "@/lib/clientsAPI";
export function ClientList({
  businessId,
  searchQuery,
}: {
  businessId: number;
  searchQuery: string;
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

  const filteredClients = clients.filter((client) => {
    const q = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(q) ||
      (client.email && client.email.toLowerCase().includes(q)) ||
      client.phone.toLowerCase().includes(q)
    );
  });

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
