"use client";

import React, { useState } from "react";
import { HiOutlineUpload, HiOutlinePencilAlt, HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineRefresh } from "react-icons/hi";

export interface ActivityEventItem {
  id: string;
  eventType: "Uploads" | "Edits" | "Signatures" | "State Changes";
  badgeLabel: string;
  badgeColor: "green" | "blue" | "yellow" | "red";
  description: string;
  actorName: string;
  actorRole?: string;
  timestamp: string;
}

interface AgreementActivityTabProps {
  events: ActivityEventItem[];
}

export const AgreementActivityTab: React.FC<AgreementActivityTabProps> = ({ events }) => {
  const [activeFilter, setActiveFilter] = useState("All Events");

  const filteredEvents = events.filter((e) => {
    if (activeFilter === "All Events") return true;
    return e.eventType === activeFilter;
  });

  const getEventIcon = (type: ActivityEventItem["eventType"], color: string) => {
    switch (color) {
      case "green":
        return <HiOutlineCheckCircle size={16} className="text-accent-green-success" />;
      case "blue":
        return <HiOutlinePencilAlt size={16} className="text-secondary-blue" />;
      case "yellow":
        return <HiOutlineRefresh size={16} className="text-accent-yellow" />;
      case "red":
        return <HiOutlineExclamationCircle size={16} className="text-accent-red" />;
      default:
        return <HiOutlineUpload size={16} className="text-white/60" />;
    }
  };

  const getBadgeStyle = (color: string) => {
    switch (color) {
      case "green":
        return "bg-accent-soft-green text-accent-green-success border-accent-green-success/30";
      case "blue":
        return "bg-primary-blue/20 text-secondary-blue border-primary-blue/30";
      case "yellow":
        return "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/30";
      case "red":
        return "bg-accent-soft-red text-accent-red border-accent-red/30";
      default:
        return "bg-white/10 text-white/70 border-white/10";
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top Section Header & Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight font-sans">
            Agreement Activity History
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Chronological audit trail of all agreement uploads, edits, signatures, and state changes.
          </p>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {["All Events", "Uploads", "Edits", "Signatures", "State Changes"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                activeFilter === filter
                  ? "bg-primary-green text-text-main border-primary-green"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Event List */}
      <div className="flex flex-col gap-4">
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-white/40 text-sm">
            No activity events recorded for this category.
          </div>
        ) : (
          filteredEvents.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-card-bg-alt/30 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/10 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  {getEventIcon(item.eventType, item.badgeColor)}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{item.badgeLabel}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getBadgeStyle(item.badgeColor)}`}>
                      {item.eventType}
                    </span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-sans">{item.description}</p>
                  <span className="text-[11px] text-text-muted mt-0.5">
                    Triggered by <strong className="text-white">{item.actorName}</strong>
                  </span>
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-xs font-mono text-white/50 shrink-0 sm:text-right">
                {item.timestamp}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
