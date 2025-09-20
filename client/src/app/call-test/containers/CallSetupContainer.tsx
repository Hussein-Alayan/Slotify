import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { CallStatus } from "../components/CallStatus";
import { BusinessClientForm } from "../components/BusinessClientForm";
import { CallControls } from "../components/CallControls";
import { RecordingIndicator } from "../components/RecordingIndicator";
import { TechnicalInfo } from "../components/TechnicalInfo";

interface CallSetupContainerProps {
  callId: number | null;
  businessId: string;
  clientId: string;
  isRecording: boolean;
  onBusinessIdChange: (value: string) => void;
  onClientIdChange: (value: string) => void;
  onStartCall: () => void;
  onStopCall: () => void;
}

export function CallSetupContainer({
  callId,
  businessId,
  clientId,
  isRecording,
  onBusinessIdChange,
  onClientIdChange,
  onStartCall,
  onStopCall,
}: CallSetupContainerProps) {
  return (
    <Card className="bg-white shadow-lg border-0 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5 text-blue-600" />
          Call Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Call Status */}
        <CallStatus callId={callId} />

        {/* Business and Client Info */}
        <BusinessClientForm
          businessId={businessId}
          clientId={clientId}
          onBusinessIdChange={onBusinessIdChange}
          onClientIdChange={onClientIdChange}
          disabled={isRecording}
        />

        {/* Call Controls */}
        <CallControls
          isRecording={isRecording}
          onStartCall={onStartCall}
          onStopCall={onStopCall}
        />

        {/* Recording Indicator */}
        <RecordingIndicator isRecording={isRecording} />

        {/* Technical Info */}
        <TechnicalInfo callId={callId} />
      </CardContent>
    </Card>
  );
}
