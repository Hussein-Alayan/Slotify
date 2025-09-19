"use client";
// pages/call-test.tsx
import { useEffect, useRef, useState, useCallback } from "react";
// Helper to start a call and get a call_id from FastAPI
async function fetchCallId(caller_phone = "test", business_id = "") {
  const resp = await fetch("http://localhost:8001/incoming/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ caller_phone, business_id }),
  });
  const data = await resp.json();
  return data.call_id;
}

/**
 * Simple call simulator page
 * - Captures mic audio
 * - Downsamples to 16kHz LINEAR16 PCM
 * - Streams PCM chunks over WebSocket to FastAPI: ws://localhost:8001/ws/call/{sessionId}
 * - Displays transcripts received from the server in real time
 *
 * Keep it simple and readable — you can replace sessionId with a real value or
 * call your /incoming/start endpoint first to get a call_id and use that value.
 */

export default function CallTest() {
  const [callId, setCallId] = useState<number | null>(null);
  const [businessId, setBusinessId] = useState("");
  // ...existing code...
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
    // Get a real call_id from FastAPI, passing businessId
    if (!businessId) {
      alert("Please enter a business ID.");
      return;
    }
    const newCallId = await fetchCallId("test", businessId);
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
    <div style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <h1>Slotify — Real-time Call Simulator</h1>

      <div>
        <strong>Call ID:</strong>{" "}
        {callId ? callId : <span style={{ color: "#888" }}>Not started</span>}
      </div>

      <div style={{ marginTop: 12 }}>
        <label>
          <strong>Business ID:</strong>
          <input
            type="text"
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
            style={{ marginLeft: 8, padding: "4px 8px", width: 120 }}
            placeholder="e.g. 1"
            disabled={isRecording}
          />
        </label>
        <div style={{ marginTop: 8 }}>
          {!isRecording ? (
            <button onClick={startCall} style={{ padding: "8px 12px" }}>
              Start Call (Mic → WS)
            </button>
          ) : (
            <button
              onClick={stopCall}
              style={{
                padding: "8px 12px",
                background: "#c33",
                color: "white",
              }}
            >
              End Call
            </button>
          )}
        </div>
      </div>

      <section style={{ marginTop: 20 }}>
        <h3>Live transcript</h3>
        <div
          style={{
            whiteSpace: "pre-wrap",
            minHeight: 120,
            border: "1px solid #ddd",
            padding: 12,
            borderRadius: 6,
            background: "#fafafa",
          }}
        >
          {transcript || (
            <span style={{ color: "#888" }}>
              No transcript yet — speak into your mic.
            </span>
          )}
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <small>
          Notes: WebSocket URL is{" "}
          <code>ws://localhost:8001/ws/call/{callId || "{call_id}"}</code>. Make
          sure FastAPI server is running and accepts PCM LINEAR16 @ 16kHz.
        </small>
      </section>
    </div>
  );
}
