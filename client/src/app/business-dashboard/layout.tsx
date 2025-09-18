"use client";
import { Sidebar } from "@/components/shared/sidebar";
import { useParams } from "next/navigation";
import { BusinessProvider } from "@/contexts/BusinessContext";

export default function BusinessDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const businessId = params.businessId
    ? parseInt(params.businessId as string, 10)
    : undefined;

  if (!businessId || isNaN(businessId)) {
    // If no valid businessId, render layout without provider
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  // Wrap both Sidebar and main in BusinessProvider
  return (
    <BusinessProvider businessId={businessId}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </BusinessProvider>
  );
}
