import { Calendar } from "lucide-react";

interface TechnicalInfoProps {
  callId: number | null;
}

export function TechnicalInfo({ callId }: TechnicalInfoProps) {
  return (
    <div className="mt-auto pt-2 border-t border-gray-100">
      <div className="flex items-start gap-2">
        <div className="p-1 bg-blue-100 rounded">
          <Calendar className="h-3 w-3 text-blue-600" />
        </div>
        <div className="text-xs text-gray-600">
          <p className="font-medium text-gray-900 mb-1">Connection</p>
          <p>
            WS:{" "}
            <code className="bg-gray-100 px-1 rounded text-xs">
              ws://localhost:8001/ws/call/{callId || "{id}"}
            </code>
          </p>
          <p>Format: PCM LINEAR16 @ 16kHz</p>
        </div>
      </div>
    </div>
  );
}
