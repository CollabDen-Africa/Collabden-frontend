"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HiX } from "react-icons/hi";
import { 
  FiSearch, 
  FiPlus, 
  FiTrash2, 
  FiDownload, 
  FiUsers, 
  FiCalendar 
} from "react-icons/fi";

// Custom UI Components
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// Schema for adding an entry
const addWaitlistSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  phone: z.string().min(5, "Phone is required").trim(),
  email: z.string().min(1, "Email is required").email("Invalid email format").trim(),
});

type AddWaitlistInput = z.infer<typeof addWaitlistSchema>;

interface WaitlistEntry {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
}

// Initial Mock Waitlist Data
const INITIAL_MOCK_WAITLIST: WaitlistEntry[] = [
  {
    id: "w-8f3e-4b2a",
    name: "Emmanuel O.",
    phone: "+234 803 123 4567",
    email: "emmanuel@collabden.com",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "w-9a2c-1d5f",
    name: "Tayo Oni",
    phone: "+234 812 345 6789",
    email: "tayo.oni@musiclab.net",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
  },
  {
    id: "w-3c4d-8e9f",
    name: "Lizz Torres",
    phone: "+1 (310) 555-0192",
    email: "lizz.t@producershed.io",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
  },
  {
    id: "w-5f6g-7h8j",
    name: "Alex Rivera",
    phone: "+1 (415) 555-0143",
    email: "alex.rivera@beatsmith.com",
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(), // 1.5 days ago
  },
  {
    id: "w-1k2l-3m4n",
    name: "David Chen",
    phone: "+65 9123 4567",
    email: "d.chen@mixmaster.sg",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
  },
  {
    id: "w-7p8q-9r1s",
    name: "Emma Wilson",
    phone: "+44 20 7946 0958",
    email: "emma.w@vocalsync.co.uk",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(), // 3 days ago
  },
  {
    id: "w-2t3u-4v5w",
    name: "Kabiru Musa",
    phone: "+234 806 987 6543",
    email: "kabiru.musa@groovebox.ng",
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(), // 5 days ago
  },
  {
    id: "w-6x7y-8z9a",
    name: "Sam Martin",
    phone: "+1 (212) 555-0177",
    email: "sam.martin@studioeast.com",
    createdAt: new Date(Date.now() - 3600000 * 150).toISOString(), // 6.2 days ago
  }
];

export default function WaitlistManagerPage() {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<AddWaitlistInput>({
    resolver: zodResolver(addWaitlistSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  // Load waitlist
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("collabden_admin_waitlist");
      if (stored) {
        setWaitlist(JSON.parse(stored));
      } else {
        localStorage.setItem("collabden_admin_waitlist", JSON.stringify(INITIAL_MOCK_WAITLIST));
        setWaitlist(INITIAL_MOCK_WAITLIST);
      }
    }
  }, []);

  // Filter waitlist entries
  const filteredWaitlist = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return waitlist;
    return waitlist.filter(
      (entry) =>
        entry.name.toLowerCase().includes(query) ||
        entry.email.toLowerCase().includes(query) ||
        entry.phone.toLowerCase().includes(query)
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

  // Add Manual Entry
  const onAddSubmit = (data: AddWaitlistInput) => {
    const newEntry: WaitlistEntry = {
      id: `w-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      phone: data.phone,
      email: data.email,
      createdAt: new Date().toISOString(),
    };

    const updated = [newEntry, ...waitlist];
    setWaitlist(updated);
    localStorage.setItem("collabden_admin_waitlist", JSON.stringify(updated));
    setIsAddModalOpen(false);
    reset();
  };

  // Delete Entry
  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    const updated = waitlist.filter((entry) => entry.id !== deleteConfirmId);
    setWaitlist(updated);
    localStorage.setItem("collabden_admin_waitlist", JSON.stringify(updated));
    setDeleteConfirmId(null);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (waitlist.length === 0) return;
    
    const headers = ["ID", "Name", "Phone", "Email", "Joined At"];
    const rows = waitlist.map((entry) => [
      entry.id,
      `"${entry.name.replace(/"/g, '""')}"`,
      `"${entry.phone.replace(/"/g, '""')}"`,
      entry.email,
      entry.createdAt,
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `collabden_waitlist_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            onClick={handleExportCSV}
            className="h-[48px] px-6 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all font-semibold text-sm flex items-center gap-2 text-white cursor-pointer"
          >
            <FiDownload size={16} />
            <span>Export to CSV</span>
          </button>

          <Button
            variant="primary"
            icon={FiPlus}
            iconPosition="left"
            onClick={() => setIsAddModalOpen(true)}
            className="h-[48px] px-6 text-sm shrink-0"
          >
            Add Email
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="w-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden shadow-lg">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left text-sm text-white/80">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white/40 text-xs font-semibold uppercase tracking-wider text-nowrap">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredWaitlist.length > 0 ? (
                filteredWaitlist.map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-bold">{entry.name || "-"}</td>
                    <td className="px-6 py-4 text-white/60 font-mono text-xs text-nowrap">{entry.phone || "-"}</td>
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
                    <td className="px-6 py-4 font-mono text-[11px] text-white/40 select-all">{entry.id}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setDeleteConfirmId(entry.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
                        title="Delete waitlist entry"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    No waitlist entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD EMAIL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white text-text-main rounded-3xl p-8 shadow-2xl border border-gray-100 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Add Waitlist Entry</h3>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  reset();
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
              >
                <HiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-4">
              <Input
                type="text"
                label="Full Name"
                variant="light"
                placeholder="John Doe"
                error={errors.name?.message}
                {...register("name")}
              />

              <Input
                type="tel"
                label="Phone Number"
                variant="light"
                placeholder="+1 (555) 012-3456"
                error={errors.phone?.message}
                {...register("phone")}
              />

              <Input
                type="email"
                label="Email Address"
                variant="light"
                placeholder="johndoe@example.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    reset();
                  }}
                  className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-full transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`flex-1 py-3 text-white font-semibold rounded-full transition-all text-sm
                    ${isValid
                      ? "bg-primary-green hover:bg-accent-green-success shadow-md"
                      : "bg-primary-green/60 cursor-not-allowed"
                    }`}
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DELETE CONFIRM */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white text-text-main rounded-3xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <FiTrash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Waitlist Entry?</h3>
              <p className="text-gray-500 text-sm font-medium">
                Are you sure you want to delete this waitlist entry? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-full transition-all text-sm animate-in"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-all text-sm shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
