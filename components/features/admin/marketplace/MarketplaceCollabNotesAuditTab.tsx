"use client";

import React, { useState } from "react";
import { HiOutlinePlus, HiOutlineLockClosed } from "react-icons/hi";

export interface NoteAuditItem {
  id: string;
  adminName: string;
  action: string;
  note?: string;
  timestamp: string;
}

interface MarketplaceCollabNotesAuditTabProps {
  logs: NoteAuditItem[];
  onAddNote?: (note: string) => void;
}

export const MarketplaceCollabNotesAuditTab: React.FC<MarketplaceCollabNotesAuditTabProps> = ({
  logs,
  onAddNote,
}) => {
  const [newNote, setNewNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote?.(newNote.trim());
    setNewNote("");
  };

  return (
    <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
      {/* Left Column: Internal Admin Notes */}
      <div className="flex flex-col gap-5 bg-card-bg-alt/30 border border-white/5 rounded-2xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted flex items-center justify-between border-b border-white/5 pb-3">
          <span>Internal Admin Notes</span>
          <span className="text-[10px] text-white/40 flex items-center gap-1 font-normal">
            <HiOutlineLockClosed size={12} /> Visible to Admins Only
          </span>
        </h3>

        {/* Add Note Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            rows={3}
            placeholder="Type an internal note regarding this collaborator profile..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary-green transition-colors resize-none custom-scrollbar"
          />
          <button
            type="submit"
            className="self-end flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-green text-white text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
          >
            <HiOutlinePlus size={15} /> Save Note
          </button>
        </form>

        {/* Notes Timeline List */}
        <div className="flex flex-col gap-3 mt-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
          {logs
            .filter((l) => l.note)
            .map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-white/2 border border-white/5 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{item.adminName}</span>
                  <span className="text-[10px] text-text-muted">{item.timestamp}</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed font-sans">{item.note}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Right Column: Moderation Audit Trail */}
      <div className="flex flex-col gap-5 bg-card-bg-alt/30 border border-white/5 rounded-2xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-white/5 pb-3">
          Moderation & Action Audit History
        </h3>

        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
          {logs.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 text-xs pb-3 border-b border-white/5 last:border-0"
            >
              <div className="w-2 h-2 rounded-full bg-primary-green mt-1.5 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{item.adminName}</span>
                  <span className="text-text-muted">— {item.action}</span>
                </div>
                <span className="text-[10px] text-white/40">{item.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
