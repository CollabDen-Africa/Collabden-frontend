"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiSmile } from "react-icons/fi";
import type { MessageReaction } from "@/types/api.types";

export const DEFAULT_REACTION_EMOJIS = ["👍", "❤️", "🔥", "😂", "😮", "🎉"];

export interface MessageReactionsProps {
  reactions?: MessageReaction[];
  currentUserId?: string;
  onToggle: (emoji: string) => void;
  disabled?: boolean;
  variant?: "dark" | "light";
  align?: "left" | "right";
}

interface Grouped {
  emoji: string;
  count: number;
  userIds: string[];
  names: string[];
  mine: boolean;
}

const nameOf = (r: MessageReaction, currentUserId?: string): string => {
  if (r.userId === currentUserId) return "You";
  return (
    r.user?.displayName ||
    [r.user?.firstName, r.user?.lastName].filter(Boolean).join(" ") ||
    "Collaborator"
  );
};

const groupReactions = (reactions: MessageReaction[], currentUserId?: string): Grouped[] => {
  const map = new Map<string, Grouped>();
  for (const r of reactions) {
    const g = map.get(r.emoji) || {
      emoji: r.emoji,
      count: 0,
      userIds: [],
      names: [],
      mine: false,
    };
    g.count += 1;
    g.userIds.push(r.userId);
    g.names.push(nameOf(r, currentUserId));
    if (r.userId === currentUserId) g.mine = true;
    map.set(r.emoji, g);
  }
  return Array.from(map.values());
};

export default function MessageReactions({
  reactions = [],
  currentUserId,
  onToggle,
  disabled = false,
  variant = "dark",
  align = "left",
}: MessageReactionsProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const grouped = useMemo(() => groupReactions(reactions, currentUserId), [reactions, currentUserId]);

  useEffect(() => {
    if (!pickerOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pickerOpen]);

  const triggerBtnClass =
    variant === "light"
      ? "bg-slate-100 hover:bg-slate-200 text-slate-500"
      : "bg-white/10 hover:bg-white/20 text-white/70";

  const pillBase =
    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer select-none";
  const pillMine =
    variant === "light"
      ? "bg-primary-green/15 border-primary-green/40 text-primary-green"
      : "bg-primary-green/25 border-primary-green text-white";
  const pillOther =
    variant === "light"
      ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
      : "bg-white/10 border-white/15 text-white/80 hover:bg-white/20";

  const handlePick = (emoji: string) => {
    setPickerOpen(false);
    if (!disabled) onToggle(emoji);
  };

  return (
    <div
      className={`flex items-center gap-1 flex-wrap mt-1 ${align === "right" ? "justify-end" : "justify-start"}`}
    >
      {grouped.map((g) => (
        <button
          key={g.emoji}
          type="button"
          disabled={disabled}
          onClick={() => onToggle(g.emoji)}
          title={g.names.join(", ")}
          className={`${pillBase} ${g.mine ? pillMine : pillOther} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span className="text-sm leading-none">{g.emoji}</span>
          <span>{g.count}</span>
        </button>
      ))}

      <div ref={pickerRef} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setPickerOpen((v) => !v)}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${triggerBtnClass} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Add reaction"
          aria-label="Add reaction"
        >
          <FiSmile size={12} />
        </button>

        {pickerOpen && (
          <div
            className={`absolute z-10 ${align === "right" ? "right-0" : "left-0"} bottom-full mb-1 bg-[#1A2328] border border-white/15 rounded-full shadow-xl px-2 py-1 flex gap-1`}
          >
            {DEFAULT_REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handlePick(emoji)}
                className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-base active:scale-90 transition-all cursor-pointer"
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
