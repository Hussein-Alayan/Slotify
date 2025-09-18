import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WelcomeSection() {
  return (
    <div className="bg-white rounded-lg border p-6 mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome back, Hussein!
          </h2>
          <p className="text-gray-600 mb-4">
            Ready to manage your businesses? Here's your dashboard overview.
          </p>

          {/* Removed Active Businesses badge */}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="bg-slate-800 text-white hover:bg-slate-700 border-slate-800"
        >
          <User className="w-4 h-4 mr-2" />
          Profile
        </Button>
      </div>
    </div>
  );
}
