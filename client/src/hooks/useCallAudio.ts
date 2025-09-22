import { useRef, useCallback } from "react";

// Helper functions for audio processing
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

export function useCallAudio() {
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const setupAudioProcessing = useCallback(
    async (websocket: WebSocket, setIsAISpeaking: (speaking: boolean) => void) => {
      console.log("🎤 Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("✅ Microphone access granted");

      const audioContext = new AudioContext();
      console.log("🎧 Audio context created, sample rate:", audioContext.sampleRate);
      audioContextRef.current = audioContext;

      // create source and processor
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      const bufferSize = 4096;
      const processor = audioContext.createScriptProcessor(bufferSize, 1, 1);
      processorRef.current = processor;

      const inputSampleRate = audioContext.sampleRate;
      const targetSampleRate = 16000;

      console.log(
        "🎵 Audio processing setup - Input rate:",
        inputSampleRate,
        "Target rate:",
        targetSampleRate
      );

      processor.onaudioprocess = (evt) => {
        const inputData = evt.inputBuffer.getChannelData(0);
        const downsampled = downsampleBuffer(
          inputData,
          inputSampleRate,
          targetSampleRate
        );
        const pcm16Buffer = floatTo16BitPCM(downsampled);

        if (websocket && websocket.readyState === WebSocket.OPEN) {
          try {
            websocket.send(pcm16Buffer);
            if (Math.random() < 0.001) {
              console.log("📤 Sending audio chunk, size:", pcm16Buffer.byteLength, "bytes");
            }
          } catch (err) {
            console.error("❌ WebSocket send error:", err);
          }
        } else {
          console.warn("⚠️ WebSocket not ready, state:", websocket?.readyState);
        }
      };

      // connect nodes
      source.connect(processor);
      processor.connect(audioContext.destination);

      // Handle incoming audio for AI responses
      return (audioData: ArrayBuffer) => {
        setIsAISpeaking(true);
        const audioContext = audioContextRef.current;
        if (!audioContext) {
          console.error("❌ No audio context available");
          return;
        }

        // LINEAR16 PCM to Float32
        const pcm16 = new Int16Array(audioData);
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
        console.log("🎵 Playing audio buffer, duration:", float32.length / 16000, "seconds");

        // Hide animation after playback
        setTimeout(
          () => {
            setIsAISpeaking(false);
            console.log("🔇 Audio playback finished");
          },
          Math.max(500, float32.length / 16)
        );
      };
    },
    []
  );

  const stopAudioProcessing = useCallback(async () => {
    try {
      if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current.onaudioprocess = null;
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (audioContextRef.current) {
        await audioContextRef.current.close();
      }
    } catch (err) {
      console.warn("Error stopping audio nodes", err);
    }
    processorRef.current = null;
    sourceRef.current = null;
    audioContextRef.current = null;
  }, []);

  return {
    setupAudioProcessing,
    stopAudioProcessing,
    wsRef,
  };
}