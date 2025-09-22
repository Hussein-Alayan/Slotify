import { Mic } from "lucide-react";

interface RecordingIndicatorProps {
  isRecording: boolean;
}

export function RecordingIndicator({ isRecording }: RecordingIndicatorProps) {
  if (!isRecording) return null;

  return (
    <div className="flex items-center justify-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      <Mic className="h-3 w-3 text-red-600" />
      <span className="text-xs font-medium text-red-700">Recording...</span>
    </div>
  );
}
