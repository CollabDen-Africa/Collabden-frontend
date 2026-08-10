"use client";

import React, { useState } from "react";
import { HiOutlineX, HiOutlineExclamation, HiOutlineBan, HiOutlineClock, HiOutlineTrash } from "react-icons/hi";

export interface ModerationTarget {
  id: string;
  name: string;
  type: "profile" | "posting";
  profileIdOrPostId: string;
  rolesOrCategory: string;
  currentStatus: string;
  avatarUrl?: string;
}

interface MarketplaceModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: ModerationTarget | null;
  onConfirm: (payload: { action: "restrict" | "suspend" | "remove"; reason: string; notes: string; notifyUser: boolean }) => Promise<void>;
}

export const MarketplaceModerationModal: React.FC<MarketplaceModerationModalProps> = ({
  isOpen,
  onClose,
  target,
  onConfirm,
}) => {
  const [selectedAction, setSelectedAction] = useState<"restrict" | "suspend" | "remove">("restrict");
  const [reason, setReason] = useState("Violation of marketplace terms");
  const [notes, setNotes] = useState("");
  const [notifyUser, setNotifyUser] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !target) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm({ action: selectedAction, reason, notes, notifyUser });
      onClose();
    } catch (err) {
      console.error("Moderation submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-card-bg-alt/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-card-bg/40">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight font-sans">
              Moderate Marketplace Content
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Action logged in audit trail • User will be notified
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <HiOutlineX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Target Content Banner */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-card-bg border border-white/10 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0">
                {target.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">{target.name}</span>
                <span className="text-xs text-text-muted font-mono">
                  {target.profileIdOrPostId} • {target.type === "profile" ? "Collaborator Profile" : "Project Posting"} • {target.rolesOrCategory}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-soft-red text-accent-red border border-accent-red/30 shrink-0">
              {target.currentStatus}
            </span>
          </div>

          {/* Moderation Action Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Moderation Action
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedAction("restrict")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  selectedAction === "restrict"
                    ? "bg-accent-yellow/15 border-accent-yellow text-accent-yellow"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                <HiOutlineBan size={20} />
                <span className="text-xs font-bold">Restrict</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction("suspend")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  selectedAction === "suspend"
                    ? "bg-primary-blue/20 border-secondary-blue text-secondary-blue"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                <HiOutlineClock size={20} />
                <span className="text-xs font-bold">Suspend</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction("remove")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  selectedAction === "remove"
                    ? "bg-accent-soft-red border-accent-red text-accent-red"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                <HiOutlineTrash size={20} />
                <span className="text-xs font-bold">Remove</span>
              </button>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-primary-green transition-colors"
            >
              <option value="Violation of marketplace terms" className="bg-card-bg-alt text-white">
                Violation of marketplace terms
              </option>
              <option value="Incomplete deliverables or ghosting" className="bg-card-bg-alt text-white">
                Incomplete deliverables or ghosting
              </option>
              <option value="Misleading posting or fake profile" className="bg-card-bg-alt text-white">
                Misleading posting or fake profile
              </option>
              <option value="Copyright infringement or stolen melody" className="bg-card-bg-alt text-white">
                Copyright infringement or stolen melody
              </option>
              <option value="Spam / Unsolicited promotion" className="bg-card-bg-alt text-white">
                Spam / Unsolicited promotion
              </option>
            </select>
          </div>

          {/* Additional Notes */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Additional Notes
            </label>
            <textarea
              rows={3}
              placeholder="Reason or explanation for audit log & user notification..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary-green transition-colors resize-none custom-scrollbar"
            />
          </div>

          {/* Notify User Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Notify User</span>
              <span className="text-[11px] text-text-muted">Send automated email notification regarding this action</span>
            </div>
            <button
              type="button"
              onClick={() => setNotifyUser(!notifyUser)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                notifyUser ? "bg-primary-green justify-end" : "bg-white/20 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Cautionary Warning Box */}
          <div className="p-4 rounded-xl bg-accent-yellow/10 border border-accent-yellow/20 flex items-start gap-3">
            <HiOutlineExclamation size={18} className="text-accent-yellow shrink-0 mt-0.5" />
            <p className="text-xs text-accent-yellow/90 leading-relaxed font-sans">
              Restricting or removing this content will hide it from marketplace search results and public discovery. This action is logged in the admin audit trail and is reversible.
            </p>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-accent-yellow text-text-main text-xs font-bold hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : `Confirm ${selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
