"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Calendar,
  Building2,
  User,
  MessageSquare,
} from "lucide-react";
// Helper to start a call and get a call_id from FastAPI
async function fetchCallId(
  caller_phone = "test",
  business_id = "",
  client_id = ""
) {
  const body: {
    caller_phone: string;
    business_id: string;
    client_id?: number;
  } = {
    caller_phone,
    business_id,
  };
  if (client_id) {
    body.client_id = parseInt(client_id, 10);
  }

  const resp = await fetch("http://localhost:8001/incoming/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await resp.json();
  return data.call_id;
}

export default function CallTest() {
  const [callId, setCallId] = useState<number | null>(null);
  const [businessId, setBusinessId] = useState("");
  const [clientId, setClientId] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // ---- Helpers: downsample & convert to 16-bit PCM ----
  function downsampleBuffer(
    buffer: Float32Array,
    inputSampleRate: number,
    outputSampleRate: number
  ) {
    if (outputSampleRate === inputSampleRate) {
      return buffer;
    }
    const sampleRateRatio = inputSampleRate / outputSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < newLength) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      // average between offsets
      let accum = 0;
      let count = 0;
      for (
        let i = offsetBuffer;
        i < nextOffsetBuffer && i < buffer.length;
        i++
      ) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = count > 0 ? accum / count : 0;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  function floatTo16BitPCM(float32Array: Float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true); // little-endian
    }
    return buffer;
  }

  // ---- Start recording + open websocket ----
  async function startCall() {
    // Get a real call_id from FastAPI, passing businessId and clientId
    if (!businessId) {
      alert("Please enter a business ID.");
      return;
    }
    const newCallId = await fetchCallId("test", businessId, clientId);
    setCallId(newCallId);
    // create websocket
    const wsUrl = `ws://localhost:8001/ws/call/${newCallId}`;
    const ws = new WebSocket(wsUrl);
    ws.binaryType = "arraybuffer";
    ws.onopen = () => console.log("WS open", wsUrl);
    ws.onmessage = (ev) => {
      // If message is ArrayBuffer, treat as TTS audio
      if (ev.data instanceof ArrayBuffer) {
        const audioContext = audioContextRef.current;
        if (!audioContext) return;
        // LINEAR16 PCM to Float32
        const pcm16 = new Int16Array(ev.data);
        const float32 = new Float32Array(pcm16.length);
        for (let i = 0; i < pcm16.length; i++) {
          float32[i] = pcm16[i] / 32768;
        }
        // Create AudioBuffer and play
        const buffer = audioContext.createBuffer(1, float32.length, 16000);
        buffer.getChannelData(0).set(float32);
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
        // Optionally, show UI indicator for TTS playback
        // ...
        return;
      }
      // Otherwise, treat as transcript text
      try {
        const text = ev.data;
        setTranscript((prev) => prev + (prev ? "\n" : "") + text);
      } catch (err) {
        console.error("WS message parse error", err);
      }
    };
    ws.onclose = () => {
      console.log("WS closed");
    };
    ws.onerror = (e) => {
      console.error("WS error", e);
    };
    wsRef.current = ws;

    // get mic
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    // create source and processor
    const source = audioContext.createMediaStreamSource(stream);
    sourceRef.current = source;

    // ScriptProcessorNode buffer size 4096 is OK for most cases.
    // You can tune this: 2048, 4096, 8192 etc.
    const bufferSize = 4096;
    const processor = audioContext.createScriptProcessor(bufferSize, 1, 1);
    processorRef.current = processor;

    const inputSampleRate = audioContext.sampleRate; // often 48000
    const targetSampleRate = 16000;

    processor.onaudioprocess = (evt) => {
      const inputData = evt.inputBuffer.getChannelData(0); // Float32Array
      // downsample to 16kHz
      const downsampled = downsampleBuffer(
        inputData,
        inputSampleRate,
        targetSampleRate
      );
      // convert float32 -> 16-bit PCM ArrayBuffer
      const pcm16Buffer = floatTo16BitPCM(downsampled);
      // send binary chunk over websocket
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(pcm16Buffer);
        } catch (err) {
          console.error("WS send error", err);
        }
      }
    };

    // connect nodes
    source.connect(processor);
    // we don't want to hear the input locally (feedback), but ScriptProcessor requires a destination in some browsers
    processor.connect(audioContext.destination);

    setIsRecording(true);
  }

  // ---- Stop recording + close websocket ----
  const stopCall = useCallback(async () => {
    setIsRecording(false);

    // stop audio nodes
    try {
      if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current.onaudioprocess = null;
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (audioContextRef.current) {
        // close audio context
        await audioContextRef.current.close();
      }
    } catch (err) {
      console.warn("Error stopping audio nodes", err);
    }
    processorRef.current = null;
    sourceRef.current = null;
    audioContextRef.current = null;

    // close websocket
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (err) {
        console.warn("Error closing websocket", err);
      }
      wsRef.current = null;
    }
  }, []);

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
          <Card className="bg-white shadow-lg border-0 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
                Call Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              {/* Call Status */}
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
                    <p className="font-medium text-gray-900 text-sm">
                      Call Status
                    </p>
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

              {/* Business and Client Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label
                    htmlFor="business-id"
                    className="flex items-center gap-1 text-xs font-medium"
                  >
                    <Building2 className="h-3 w-3 text-blue-600" />
                    Business ID *
                  </Label>
                  <Input
                    id="business-id"
                    type="text"
                    value={businessId}
                    onChange={(e) => setBusinessId(e.target.value)}
                    placeholder="e.g., 3"
                    disabled={isRecording}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor="client-id"
                    className="flex items-center gap-1 text-xs font-medium"
                  >
                    <User className="h-3 w-3 text-blue-600" />
                    Client ID (Optional)
                  </Label>
                  <Input
                    id="client-id"
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="e.g., 1"
                    disabled={isRecording}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-8 text-sm"
                  />
                </div>
              </div>

              {/* Call Controls */}
              <div className="flex justify-center pt-2">
                {!isRecording ? (
                  <Button
                    onClick={startCall}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <PhoneCall className="h-4 w-4 mr-2" />
                    Start Call
                  </Button>
                ) : (
                  <Button
                    onClick={stopCall}
                    size="lg"
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <PhoneOff className="h-4 w-4 mr-2" />
                    End Call
                  </Button>
                )}
              </div>

              {/* Recording Indicator */}
              {isRecording && (
                <div className="flex items-center justify-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <Mic className="h-3 w-3 text-red-600" />
                  <span className="text-xs font-medium text-red-700">
                    Recording...
                  </span>
                </div>
              )}

              {/* Technical Info */}
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
            </CardContent>
          </Card>

          {/* Right Column - Live Transcript */}
          <Card className="bg-white shadow-lg border-0 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Live Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <div className="h-full overflow-y-auto p-3 bg-gray-50 rounded-lg border border-gray-200">
                {transcript ? (
                  <div className="space-y-2">
                    {transcript.split("\n").map((line, index) => (
                      <div
                        key={index}
                        className="p-2 bg-white rounded-lg shadow-sm border-l-4 border-blue-500"
                      >
                        <p className="text-gray-800 leading-relaxed text-sm">
                          {line}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageSquare className="h-10 w-10 mb-2 text-gray-300" />
                    <p className="text-center text-sm">
                      No conversation yet — start a call and speak into your
                      microphone
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
