"use client";

import React from "react";

export interface WaitlistEntry {
  id: string;
  name?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  email: string;
  createdAt: string;
}

interface WaitlistTableProps {
  entries: WaitlistEntry[];
}

export const WaitlistTable: React.FC<WaitlistTableProps> = ({ entries }) => {
  return (
    <div className="w-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden shadow-lg">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse text-left text-sm text-white/80">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-white/40 text-xs font-semibold uppercase tracking-wider text-nowrap">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Phone Number</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-medium">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-white font-bold">{entry.name || "-"}</td>
                <td className="px-6 py-4 text-white/60 font-mono text-xs text-nowrap">{entry.phone || entry.phoneNumber || "-"}</td>
                <td className="px-6 py-4 text-primary-green">{entry.email}</td>
                <td className="px-6 py-4 text-white/50 text-xs text-nowrap">
                  {new Date(entry.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WaitlistTable;
