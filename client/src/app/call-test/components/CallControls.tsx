import { Button } from "@/components/ui/button";
import { PhoneCall, PhoneOff } from "lucide-react";

interface CallControlsProps {
  isRecording: boolean;
  onStartCall: () => void;
  onStopCall: () => void;
}

export function CallControls({
  isRecording,
  onStartCall,
  onStopCall,
}: CallControlsProps) {
  return (
    <div className="flex justify-center pt-2">
      {!isRecording ? (
        <Button
          onClick={onStartCall}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <PhoneCall className="h-4 w-4 mr-2" />
          Start Call
        </Button>
      ) : (
        <Button
          onClick={onStopCall}
          size="lg"
          variant="destructive"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <PhoneOff className="h-4 w-4 mr-2" />
          End Call
        </Button>
      )}
    </div>
  );
}
