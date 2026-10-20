import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_VOICE_DURATION_SECONDS } from "@/types/messaging.types";

export type VoiceRecorderState = "idle" | "recording" | "stopped";

export interface RecordedVoice {
  blob: Blob;
  durationSeconds: number;
  mimeType: string;
  objectUrl: string;
}

interface UseVoiceRecorderResult {
  state: VoiceRecorderState;
  elapsedSeconds: number;
  recording: RecordedVoice | null;
  error: string | null;
  isSupported: boolean;
  start: () => Promise<void>;
  stop: () => Promise<RecordedVoice | null>;
  cancel: () => void;
  reset: () => void;
}

const pickMimeType = (): string => {
  if (typeof MediaRecorder === "undefined") return "audio/webm";
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported?.(type)) return type;
  }
  return "audio/webm";
};

export const useVoiceRecorder = (): UseVoiceRecorderResult => {
  const [state, setState] = useState<VoiceRecorderState>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [recording, setRecording] = useState<RecordedVoice | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopResolverRef = useRef<((value: RecordedVoice | null) => void) | null>(null);
  const startedAtRef = useRef<number>(0);
  const previousObjectUrlRef = useRef<string | null>(null);
  const cancelledRef = useRef<boolean>(false);

  const isSupported =
    typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices?.getUserMedia === "function" &&
    typeof MediaRecorder !== "undefined";

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const releaseStream = () => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    streamRef.current = null;
    recorderRef.current = null;
  };

  const releasePreviousObjectUrl = () => {
    if (previousObjectUrlRef.current) {
      URL.revokeObjectURL(previousObjectUrlRef.current);
      previousObjectUrlRef.current = null;
    }
  };

  const reset = useCallback(() => {
    clearTimer();
    releaseStream();
    releasePreviousObjectUrl();
    chunksRef.current = [];
    stopResolverRef.current = null;
    setState("idle");
    setElapsedSeconds(0);
    setRecording(null);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      releaseStream();
      releasePreviousObjectUrl();
    };
  }, []);

  const start = useCallback(async () => {
    if (!isSupported) {
      setError("Voice recording is not supported in this browser.");
      return;
    }
    if (state === "recording") return;

    setError(null);
    releasePreviousObjectUrl();
    setRecording(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;

      recorder.addEventListener("dataavailable", (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      });

      recorder.addEventListener("stop", () => {
        clearTimer();
        const wasCancelled = cancelledRef.current;
        cancelledRef.current = false;
        const durationSeconds = Math.max(
          1,
          Math.min(
            MAX_VOICE_DURATION_SECONDS,
            Math.round((Date.now() - startedAtRef.current) / 1000)
          )
        );
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];
        releaseStream();

        if (wasCancelled) {
          const resolver = stopResolverRef.current;
          stopResolverRef.current = null;
          resolver?.(null);
          return;
        }

        if (blob.size === 0) {
          setState("idle");
          const resolver = stopResolverRef.current;
          stopResolverRef.current = null;
          resolver?.(null);
          return;
        }

        const objectUrl = URL.createObjectURL(blob);
        previousObjectUrlRef.current = objectUrl;
        const result: RecordedVoice = { blob, durationSeconds, mimeType, objectUrl };
        setRecording(result);
        setState("stopped");

        const resolver = stopResolverRef.current;
        stopResolverRef.current = null;
        resolver?.(result);
      });

      startedAtRef.current = Date.now();
      recorder.start(250);
      setState("recording");
      setElapsedSeconds(0);

      timerRef.current = setInterval(() => {
        const elapsed = Math.round((Date.now() - startedAtRef.current) / 1000);
        setElapsedSeconds(elapsed);
        if (elapsed >= MAX_VOICE_DURATION_SECONDS && recorder.state === "recording") {
          recorder.stop();
        }
      }, 250);
    } catch (err: any) {
      releaseStream();
      setState("idle");
      if (err?.name === "NotAllowedError") {
        setError("Microphone access denied. Enable it in your browser settings to record voice notes.");
      } else if (err?.name === "NotFoundError") {
        setError("No microphone found on this device.");
      } else {
        setError(err?.message || "Could not start recording.");
      }
    }
  }, [isSupported, state]);

  const stop = useCallback((): Promise<RecordedVoice | null> => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      return Promise.resolve(recording);
    }
    return new Promise((resolve) => {
      stopResolverRef.current = resolve;
      recorder.stop();
    });
  }, [recording]);

  const cancel = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state === "recording") {
      cancelledRef.current = true;
      stopResolverRef.current = null;
      recorder.stop();
    }
    reset();
  }, [reset]);

  return {
    state,
    elapsedSeconds,
    recording,
    error,
    isSupported,
    start,
    stop,
    cancel,
    reset,
  };
};
