"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone } from "lucide-react";
import { fetchCallId } from "@/lib/api";
import { useCallAudio } from "@/hooks/useCallAudio";
import { CallSetupContainer } from "./containers/CallSetupContainer";
import { VoiceAssistantContainer } from "./containers/VoiceAssistantContainer";

export default function CallTest() {
  const [callId, setCallId] = useState<number | null>(null);
  const [businessId, setBusinessId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  const { setupAudioProcessing, stopAudioProcessing, wsRef } = useCallAudio();

  // ---- Start recording + open websocket ----
  async function startCall() {
    if (!businessId) {
      alert("Please select a business.");
      return;
    }

    if (!clientName.trim()) {
      alert("Please enter client name.");
      return;
    }

    if (!clientPhone.trim()) {
      alert("Please enter client phone number.");
      return;
    }

    console.log(
      "🔄 Starting call with businessId:",
      businessId,
      "clientName:",
      clientName,
      "clientPhone:",
      clientPhone
    );

    try {
      const newCallId = await fetchCallId(
        "test",
        businessId,
        clientName,
        clientPhone
      );
      console.log(" Got call ID:", newCallId);
      setCallId(parseInt(newCallId, 10));

      // create websocket
      const wsUrl = `ws://localhost:8001/ws/call/${newCallId}`;
      console.log("🔌 Connecting to WebSocket:", wsUrl);
      const ws = new WebSocket(wsUrl);
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        console.log("✅ WebSocket connected:", wsUrl);
      };

      ws.onmessage = (ev) => {
        // If message is ArrayBuffer, treat as TTS audio (AI speaking)
        if (ev.data instanceof ArrayBuffer) {
          console.log(
            "🔊 Received audio data, size:",
            ev.data.byteLength,
            "bytes"
          );
          handleAudioData(ev.data);
          return;
        } else if (typeof ev.data === "string") {
          console.log("💬 Received text message:", ev.data);
        } else {
          console.log(
            " Received unknown message type:",
            typeof ev.data,
            ev.data
          );
        }
      };

      ws.onclose = (event) => {
        console.log(
          "🔌 WebSocket closed. Code:",
          event.code,
          "Reason:",
          event.reason
        );
      };

      ws.onerror = (e) => {
        console.error(" WebSocket error:", e);
      };

      wsRef.current = ws;

      // Setup audio processing
      const handleAudioData = await setupAudioProcessing(ws, setIsAISpeaking);

      setIsRecording(true);
      console.log("Call started successfully!");
    } catch (error) {
      console.error("Error starting call:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      alert("Failed to start call: " + message);
    }
  }

  // ---- Stop recording + close websocket ----
  const stopCall = useCallback(async () => {
    setIsRecording(false);
    await stopAudioProcessing();

    // close websocket
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (err) {
        console.warn("Error closing websocket", err);
      }
      wsRef.current = null;
    }
    setCallId(null);
  }, [stopAudioProcessing, wsRef]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      stopCall();
    };
  }, [stopCall]);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 overflow-hidden">
      <div className="h-full max-w-6xl mx-auto flex flex-col gap-4">
        {/* Header - Compact */}
        <Card className="bg-white shadow-lg border-0 flex-shrink-0">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Phone className="h-5 w-5 text-white" />
              </div>
              Slotify Voice Booking
              <span className="text-sm font-normal text-gray-600 ml-2">
                Call a business to book your appointment through AI
              </span>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Main Content - Two Column Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
          {/* Left Column - Call Setup */}
          <CallSetupContainer
            callId={callId}
            businessId={businessId}
            clientName={clientName}
            clientPhone={clientPhone}
            isRecording={isRecording}
            onBusinessIdChange={setBusinessId}
            onClientNameChange={setClientName}
            onClientPhoneChange={setClientPhone}
            onStartCall={startCall}
            onStopCall={stopCall}
          />

          {/* Right Column - AI Voice Animation */}
          <VoiceAssistantContainer isAISpeaking={isAISpeaking} />
        </div>
      </div>
    </div>
  );
}
