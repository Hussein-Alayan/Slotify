import { Badge } from "@/components/ui/badge";
import { PhoneCall, PhoneOff } from "lucide-react";

interface CallStatusProps {
  callId: number | null;
}

export function CallStatus({ callId }: CallStatusProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-full ${
            callId ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          {callId ? (
            <PhoneCall className="h-4 w-4 text-green-600" />
          ) : (
            <PhoneOff className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">Call Status</p>
          <p className="text-xs text-gray-600">
            {callId ? `Connected - ID: ${callId}` : "Not connected"}
          </p>
        </div>
      </div>
      {callId && (
        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
          Active
        </Badge>
      )}
    </div>
    );
  }
