"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MAX_DURATION_MS = 180_000; // 3 minutes
const WARNING_MS = 150_000; // 2:30 warning
const MIN_DURATION_MS = 2_000; // 2 seconds minimum
const SILENCE_THRESHOLD = 0.01; // RMS below this = silence
const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10 MB — matches backend limit

// Known Whisper hallucinations on silent/near-silent audio
const WHISPER_HALLUCINATIONS = [
  "thank you",
  "thanks for watching",
  "thank you for watching",
  "subscribe",
  "like and subscribe",
  "please subscribe",
  "the end",
  "bye",
  "goodbye",
  "see you",
  "see you next time",
  "you",
  "...",
  "tch",
  "trigger warning",
];

export type MicrophoneState = "idle" | "recording" | "transcribing";

interface UseMicrophoneOptions {
  onTranscription: (text: string) => void;
  onError?: (message: string) => void;
  transcribe: (audioBlob: Blob) => Promise<string>;
}

export function useMicrophone({
  onTranscription,
  onError,
  transcribe,
}: UseMicrophoneOptions) {
  const [state, setState] = useState<MicrophoneState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [nearLimit, setNearLimit] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hadSpeechRef = useRef(false);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const silenceCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs for callbacks to avoid stale closures
  const onTranscriptionRef = useRef(onTranscription);
  onTranscriptionRef.current = onTranscription;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const transcribeRef = useRef(transcribe);
  transcribeRef.current = transcribe;

  const processAudio = useCallback(async (blob: Blob) => {
    const duration = Date.now() - startTimeRef.current;

    if (blob.size === 0) {
      onErrorRef.current?.("No audio was captured. Please check your microphone.");
      setState("idle");
      return;
    }

    if (blob.size > MAX_AUDIO_SIZE) {
      onErrorRef.current?.("Recording is too large to upload. Please try a shorter recording.");
      setState("idle");
      return;
    }

    if (duration < MIN_DURATION_MS) {
      onErrorRef.current?.("Recording too short. Hold the button and speak for at least 2 seconds.");
      setState("idle");
      return;
    }

    if (!hadSpeechRef.current) {
      onErrorRef.current?.("No speech detected. Please speak clearly into your microphone.");
      setState("idle");
      return;
    }

    setState("transcribing");

    try {
      const text = await transcribeRef.current(blob);
      const normalized = text.trim().toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();

      if (
        !normalized ||
        normalized.split(" ").length <= 3 && WHISPER_HALLUCINATIONS.some((h) => normalized.includes(h))
      ) {
        onErrorRef.current?.("No speech detected. Please speak clearly into your microphone and try again.");
        setState("idle");
        return;
      }

      onTranscriptionRef.current(text);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Transcription failed. Please try again.";
      onErrorRef.current?.(message);
    } finally {
      setState("idle");
    }
  }, []);

  const stopRecording = useCallback(() => {
    // Clear timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (autoStopRef.current) {
      clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
    if (silenceCheckRef.current) {
      clearInterval(silenceCheckRef.current);
      silenceCheckRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
      analyserRef.current = null;
    }

    setNearLimit(false);

    // Stop the recorder — this triggers the onstop handler which calls processAudio
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    // Stop all mic tracks
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up audio level analysis to detect silence
      hadSpeechRef.current = false;
      try {
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        audioCtxRef.current = audioCtx;
        analyserRef.current = analyser;

        const dataArray = new Float32Array(analyser.fftSize);
        silenceCheckRef.current = setInterval(() => {
          analyser.getFloatTimeDomainData(dataArray);
          // Calculate RMS (root mean square) of audio signal
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i] * dataArray[i];
          }
          const rms = Math.sqrt(sum / dataArray.length);
          if (rms > SILENCE_THRESHOLD) {
            hadSpeechRef.current = true;
          }
        }, 200);
      } catch {
        // If AudioContext fails, assume speech is present to avoid blocking
        hadSpeechRef.current = true;
      }

      // Determine best supported mime type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        processAudio(blob);
      };

      recorder.onerror = () => {
        onErrorRef.current?.("Recording failed. Please check your microphone.");
        setState("idle");
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000); // Collect data every second

      // Start elapsed timer
      startTimeRef.current = Date.now();
      setElapsed(0);
      setNearLimit(false);

      timerRef.current = setInterval(() => {
        const ms = Date.now() - startTimeRef.current;
        setElapsed(ms);
        if (ms >= WARNING_MS) {
          setNearLimit(true);
        }
      }, 200);

      // Auto-stop at max duration
      autoStopRef.current = setTimeout(() => {
        stopRecording();
      }, MAX_DURATION_MS);

      setState("recording");
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        onErrorRef.current?.(
          "Microphone access denied. Please allow microphone access in your browser settings."
        );
      } else {
        onErrorRef.current?.("Could not access microphone. Please check your device.");
      }
      setState("idle");
    }
  }, [processAudio, stopRecording]);

  const toggle = useCallback(() => {
    if (state === "recording") {
      stopRecording();
    } else if (state === "idle") {
      startRecording();
    }
    // If "transcribing", do nothing — wait for it to finish
  }, [state, startRecording, stopRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoStopRef.current) clearTimeout(autoStopRef.current);
      if (silenceCheckRef.current) clearInterval(silenceCheckRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
      if (mediaRecorderRef.current?.state !== "inactive") {
        try {
          mediaRecorderRef.current?.stop();
        } catch {
          /* ignore */
        }
      }
      mediaRecorderRef.current?.stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return {
    state,
    elapsed,
    nearLimit,
    toggle,
  };
}

/** Format milliseconds as M:SS */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
