import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useRouter } from "next/navigation";

interface BusinessCardProps {
  id: number;
  name: string;
  category: string;
  status: "Active" | "Inactive" | "Pending";
}

export function BusinessCard({
  id,
  name,
  category,
  status,
}: BusinessCardProps) {
  const router = useRouter();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "Inactive":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Business Info */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
            <p className="text-sm text-gray-600">{category}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Badge variant="secondary" className={getStatusColor(status)}>
              {status}
            </Badge>

            <Button
              size="sm"
              className="bg-slate-800 text-white hover:bg-slate-700"
              onClick={() => router.push(`/business-dashboard/${id}`)}
            >
              View Dashboard
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
