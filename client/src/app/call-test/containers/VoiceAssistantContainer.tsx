import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { VoiceAnimation } from "../components/VoiceAnimation";

interface VoiceAssistantContainerProps {
  isAISpeaking: boolean;
}

export function VoiceAssistantContainer({
  isAISpeaking,
}: VoiceAssistantContainerProps) {
  return (
    <Card className="bg-white shadow-lg border-0 flex flex-col">
      <CardHeader className="pb-3 text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          AI Assistant Voice
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center min-h-0">
        <VoiceAnimation isAISpeaking={isAISpeaking} />
      </CardContent>
    </Card>
  );
}
