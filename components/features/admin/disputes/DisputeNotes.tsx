"use client";

import React, { useState } from "react";
import { HiOutlineLockClosed } from "react-icons/hi";
import { HiOutlinePaperAirplane, HiPlus } from "react-icons/hi2";
import Avatar from "@/components/ui/Avatar";
import { addDisputeNote, type InvestigationNote } from "@/services/admin/disputes.service";
import { useQueryClient } from "@tanstack/react-query";

interface DisputeNotesProps {
  disputeId: string;
  notes: InvestigationNote[];
}

export const DisputeNotes: React.FC<DisputeNotesProps> = ({ disputeId, notes: initialNotes }) => {
  const [notes, setNotes] = useState<InvestigationNote[]>(initialNotes);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;
    setIsAdding(true);
    try {
      const created = await addDisputeNote(disputeId, newNoteContent.trim());
      setNotes((prev) => [...prev, created]);
      setNewNoteContent("");
      queryClient.invalidateQueries({ queryKey: ["adminDispute", disputeId] });
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  return (
    <div className="p-6 md:p-8 bg-[#0a0a0c] flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 bg-[#72c043] rounded-full" />
          <h3 className="text-base font-bold text-white">Investigation Notes</h3>
        </div>
        <button
          onClick={() => document.getElementById("dispute-note-input")?.focus()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#72c043] hover:bg-[#84d653] text-[#0d0f10] text-xs font-bold transition-colors"
        >
          <HiPlus size={14} />
          Add Note
        </button>
      </div>

      {/* Notes Timeline */}
      <div className="flex flex-col gap-4">
        {notes.length === 0 ? (
          <div className="py-12 text-center text-white/30 text-sm">
            No investigation notes yet. Add the first note above.
          </div>
        ) : (
          notes.map((note) => {
            const date = new Date(note.createdAt);
            const dateStr = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const timeStr = date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });

            return (
              <div
                key={note.id}
                className="bg-[#121415] border border-white/5 rounded-2xl p-5 flex flex-col gap-4"
              >
                {/* Note header */}
                <div className="flex items-center gap-3">
                  <Avatar name={note.adminName} className="w-8 h-8 text-xs" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{note.adminName}</span>
                    <span className="text-xs text-white/40 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full border border-white/20 inline-flex items-center justify-center">
                          <span className="w-1 h-1 rounded-full bg-white/40" />
                        </span>
                        {dateStr} · {timeStr}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Note body */}
                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>

                {/* Privacy indicator */}
                <div className="flex items-center gap-2 text-xs text-white/30">
                  <HiOutlineLockClosed size={13} />
                  Internal note · Visible to administrators only
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add note input */}
      <div className="bg-[#121415] border border-white/5 rounded-2xl p-4 flex items-end gap-3">
        <input
          id="dispute-note-input"
          type="text"
          placeholder="Add an internal investigation note..."
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none text-sm text-white placeholder-white/20 focus:outline-none"
        />
        <button
          onClick={handleAddNote}
          disabled={isAdding || !newNoteContent.trim()}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#72c043] hover:bg-[#84d653] disabled:opacity-40 disabled:cursor-not-allowed text-[#0d0f10] text-xs font-bold transition-colors shrink-0"
        >
          <HiOutlinePaperAirplane size={14} className="-rotate-45" />
          {isAdding ? "Saving..." : "Add Note"}
        </button>
      </div>
    </div>
  );
};
