"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiPlay, FiPause } from "react-icons/fi";

interface VoiceNotePlayerProps {
  src: string;
  durationSeconds: number;
  variant?: "dark" | "light";
  className?: string;
}

const formatClock = (secs: number) => {
  const s = Math.max(0, Math.floor(secs));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
};


const forceMetadataLoad = (audio: HTMLAudioElement) =>
  new Promise<void>((resolve) => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      resolve();
      return;
    }
    const onDurationChange = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.removeEventListener("durationchange", onDurationChange);
        audio.currentTime = 0;
        resolve();
      }
    };
    audio.addEventListener("durationchange", onDurationChange);
    try {
      audio.currentTime = 1e101;
    } catch {
      audio.currentTime = 1_000_000;
    }
  });

const PLAYBACK_SPEEDS = [1, 1.5, 2] as const;
type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

const formatSpeed = (speed: PlaybackSpeed) =>
  speed === 1 ? "1x" : speed === 1.5 ? "1.5x" : "2x";

export default function VoiceNotePlayer({
  src,
  durationSeconds,
  variant = "dark",
  className = "",
}: VoiceNotePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [metadataReady, setMetadataReady] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);

  const isLight = variant === "light";
  const barBg = isLight ? "bg-slate-200" : "bg-white/15";
  const barFill = isLight ? "bg-[#204F99]" : "bg-primary-green";
  const btnBg = isLight ? "bg-[#204F99] text-white" : "bg-primary-green text-white";
  const textMuted = isLight ? "text-slate-500" : "text-white/60";
  const speedChipBg = isLight
    ? "bg-[#204F99]/10 text-[#204F99] hover:bg-[#204F99]/20"
    : "bg-white/10 text-white/80 hover:bg-white/20";

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setMetadataReady(false);
    setSpeed(1);
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speed;
    // Keep pitch natural at non-1x speeds (default in most browsers, but set
    // defensively — Safari has historically reset preservesPitch on seek).
    if ("preservesPitch" in audio) {
      (audio as HTMLAudioElement & { preservesPitch: boolean }).preservesPitch = true;
    }
  }, [speed, src, metadataReady]);

  const cycleSpeed = () => {
    setSpeed((prev) => {
      const idx = PLAYBACK_SPEEDS.indexOf(prev);
      return PLAYBACK_SPEEDS[(idx + 1) % PLAYBACK_SPEEDS.length];
    });
  };

  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!metadataReady) {
      await forceMetadataLoad(audio);
      setMetadataReady(true);
    }
    try {
      await audio.play();
    } catch {
      /* user may need to interact first in some browsers */
    }
  };

  const pause = () => {
    audioRef.current?.pause();
  };

  const togglePlay = () => (isPlaying ? pause() : play());

  const seekTo = (clientX: number, rect: DOMRect) => {
    const audio = audioRef.current;
    if (!audio || !durationSeconds) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const target = ratio * durationSeconds;
    audio.currentTime = target;
    setCurrentTime(target);
  };

  const progressRatio = durationSeconds > 0 ? Math.min(1, currentTime / durationSeconds) : 0;

  return (
    <div className={`flex items-center gap-3 min-w-0 sm:min-w-[200px] ${className}`}>
      <button
        type="button"
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-all cursor-pointer ${btnBg}`}
        aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
      >
        {isPlaying ? <FiPause size={15} /> : <FiPlay size={15} className="ml-0.5" />}
      </button>

      <div
        className={`flex-1 h-1.5 rounded-full ${barBg} relative cursor-pointer`}
        onClick={(e) => seekTo(e.clientX, e.currentTarget.getBoundingClientRect())}
      >
        <div
          className={`h-full rounded-full ${barFill}`}
          style={{ width: `${progressRatio * 100}%` }}
        />
      </div>

      <span className={`text-[11px] font-semibold shrink-0 tabular-nums ${textMuted}`}>
        {formatClock(isPlaying ? currentTime : durationSeconds)}
      </span>

      <button
        type="button"
        onClick={cycleSpeed}
        className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold tabular-nums shrink-0 transition-colors cursor-pointer ${speedChipBg}`}
        aria-label={`Playback speed ${formatSpeed(speed)}, click to change`}
        title={`Playback speed ${formatSpeed(speed)}`}
      >
        {formatSpeed(speed)}
      </button>

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onTimeUpdate={(e) => {
          const t = (e.target as HTMLAudioElement).currentTime;
          if (Number.isFinite(t)) setCurrentTime(t);
        }}
        className="hidden"
      />
    </div>
  );
}
