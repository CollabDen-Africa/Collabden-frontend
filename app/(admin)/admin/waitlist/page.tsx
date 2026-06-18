"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  FiSearch, 
  FiDownload, 
  FiUsers, 
  FiCalendar 
} from "react-icons/fi";



interface WaitlistEntry {
  id: string;
  name?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  email: string;
  createdAt: string;
}

export default function WaitlistManagerPage() {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch waitlist entries from backend
  const fetchWaitlist = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/proxy/waitlist");
      if (!response.ok) {
        throw new Error("Failed to fetch waitlist entries");
      }
      const data = await response.json();
      setWaitlist(Array.isArray(data) ? data : data.data || []);
    } catch (err: any) {
      console.error("Error fetching waitlist:", err);
      setError(err.message || "Failed to load waitlist entries.");
      setWaitlist([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  // Filter waitlist entries
  const filteredWaitlist = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return waitlist;
    return waitlist.filter(
      (entry) =>
        (entry.name || "").toLowerCase().includes(query) ||
        (entry.email || "").toLowerCase().includes(query) ||
        (entry.phone || entry.phoneNumber || "").toLowerCase().includes(query)
    );
  }, [waitlist, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = waitlist.length;
    const oneDayAgo = Date.now() - 24 * 3600 * 1000;
    const todayCount = waitlist.filter(
      (entry) => new Date(entry.createdAt).getTime() > oneDayAgo
    ).length;

    return {
      total,
      today: todayCount,
    };
  }, [waitlist]);

  // Export to Excel (via backend endpoint)
  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/proxy/waitlist/download");
      if (!response.ok) {
        throw new Error("Failed to download waitlist");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `collabden_waitlist_${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting Excel:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">Total Signups</span>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <span className="text-primary-green/80 text-xl font-bold"><FiUsers size={24} /></span>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">Added Today</span>
            <div className="text-2xl font-bold">{stats.today}</div>
          </div>
          <span className="text-primary-blue/80 text-xl font-bold"><FiCalendar size={24} /></span>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">Export State</span>
            <div className="text-2xl font-bold text-primary-green">Ready</div>
          </div>
          <span className="text-primary-green/80 text-xl font-bold"><FiDownload size={24} /></span>
        </div>
      </div>

      {/* Filters / Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="flex items-center gap-2 bg-black/30 w-full h-[48px] pl-4 pr-4 rounded-full border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] focus-within:border-primary-green backdrop-blur-md">
            <FiSearch className="text-white/30 shrink-0" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="bg-transparent border-none outline-none text-white text-[13px] placeholder:text-white/30 w-full font-medium"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="h-[48px] px-6 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all font-semibold text-sm flex items-center gap-2 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload size={16} />
            <span>{isExporting ? "Exporting..." : "Export Excel"}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 text-sm font-medium tracking-wide">Syncing entries...</p>
        </div>
      ) : error ? (
        <div className="w-full py-16 md:py-24 rounded-3xl bg-white/5 border border-red-500/20 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-center px-6 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-2 animate-bounce">
            <FiUsers size={28} />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">No waitlist entries yet</h3>
          <p className="text-white/50 text-sm font-medium max-w-sm">
            There are currently no records found on the early access waitlist. Newly joined users will appear here in real-time.
          </p>
        </div>
      ) : filteredWaitlist.length > 0 ? (
        /* Data Table */
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
                {filteredWaitlist.map((entry) => (
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
      ) : (
        /* Empty State */
        <div className="w-full py-16 md:py-24 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-center px-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 mb-2">
            <FiUsers size={28} />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">No waitlist entries yet</h3>
          <p className="text-white/50 text-sm font-medium max-w-sm">
            There are currently no users registered on the early access waitlist. Newly joined users will appear here in real-time.
          </p>
        </div>
      )}
    </div>
  );
}
