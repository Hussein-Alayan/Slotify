"use client";

import { DashboardHeader } from "../components/dashboard-header";
import { StatsGrid } from "../components/stats-grid";
import { ScheduleCard } from "../components/schedule-card";
import { ActivityCard } from "../components/activity-card";
import { QuickActions } from "../components/quick-actions";

export function DashboardContainer({ totalClients }: { totalClients: number }) {
  return (
    <div className="p-6 space-y-6">
      <DashboardHeader />
      <StatsGrid totalClients={totalClients} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ScheduleCard />
        <ActivityCard />
      </div>

      <QuickActions />
    </div>
  );
}
