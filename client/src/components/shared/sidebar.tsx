"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserCheck,
  Settings,
  Menu,
  ArrowLeft,
} from "lucide-react";
import { useBusinessContext } from "@/contexts/BusinessContext";

function getNavigationLinks(businessId: number) {
  return [
    {
      name: "Dashboard",
      href: `/business-dashboard/${businessId}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      name: "Services",
      href: `/business-dashboard/${businessId}/services`,
      icon: Briefcase,
    },
    {
      name: "Staff",
      href: `/business-dashboard/${businessId}/staff`,
      icon: UserCheck,
    },
    {
      name: "Clients",
      href: `/business-dashboard/${businessId}/clients`,
      icon: Users,
    },
    {
      name: "Settings",
      href: `/business-dashboard/${businessId}/settings`,
      icon: Settings,
    },
  ];
}

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { businessId } = useBusinessContext();
  const navigation = getNavigationLinks(businessId);

  return (
    <div
      className={cn(
        "bg-slate-900 text-white transition-all duration-300 sticky top-0 h-screen",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <span className="text-xl font-semibold">
              {/* TODO: Replace with real business name from context/API */}
              Business Name
            </span>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-8 px-2">
        {/* Back to Business Hub Button */}
        <div className="mb-6">
          <Link
            href="/business-hub"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Back to Hub</span>}
          </Link>
        </div>

        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
