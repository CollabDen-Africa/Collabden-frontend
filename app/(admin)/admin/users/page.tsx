"use client";

import React, { useState } from "react";
import { 
  HiOutlineSearch, 
  HiOutlineFilter,
  HiCheckCircle,
  HiClock,
  HiMinusCircle
} from "react-icons/hi";
import { HiOutlineChevronUpDown } from "react-icons/hi2";
import { useUsers } from "@/hooks/admin/useUsers";
import { useRouter } from "next/navigation";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { ExportCSVButton } from "@/components/ui/ExportCSVButton";

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-500",
    DEACTIVATED: "bg-gray-500/10 text-gray-500",
    DELETED: "bg-gray-500/10 text-gray-500",
    SUSPENDED: "bg-yellow-500/10 text-yellow-500",
    BANNED: "bg-red-500/10 text-red-500",
  };
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-500/10 text-gray-400"}`}>
      {displayStatus}
    </span>
  );
};

const VerificationBadge = ({ isVerified, identityVerified }: { isVerified: boolean, identityVerified: boolean }) => {
  if (isVerified && identityVerified) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
        <HiCheckCircle size={14} /> Verified
      </span>
    );
  }
  if (!isVerified && !identityVerified) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400">
        <HiMinusCircle size={14} /> Unverified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
      <HiClock size={14} /> Pending
    </span>
  );
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useUsers({
    page,
    limit,
    search: searchTerm || undefined,
  });
  const router = useRouter();

  const stats = data?.stats || {
    totalUsers: 0,
    active: 0,
    suspended: 0,
    pendingVerif: 0,
    banned: 0,
  };

  const statCards = [
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), color: "bg-[#72c043]" },
    { label: "Active", value: stats.active.toLocaleString(), color: "bg-[#72c043]" },
    { label: "Suspended", value: stats.suspended.toLocaleString(), color: "bg-[#eab308]" },
    { label: "Pending Verif.", value: stats.pendingVerif.toLocaleString(), color: "bg-[#a855f7]" },
    { label: "Banned", value: stats.banned.toLocaleString(), color: "bg-[#ef4444]" },
  ];

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
          <p className="text-white/40 text-sm mt-1">View, search, and manage all registered users on the platform.</p>
        </div>
        <ExportCSVButton 
          data={data?.users || []} 
          filename="collabden-users.csv"
          headers={[
            { label: "ID", key: "id" },
            { label: "First Name", key: "firstName" },
            { label: "Last Name", key: "lastName" },
            { label: "Email", key: "email" },
            { label: "Status", key: "accountStatus" },
            { label: "Tier", key: "tier" },
            { label: "Joined", key: "createdAt" },
          ]}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-white tracking-tight">{isLoading ? "..." : stat.value}</span>
              <span className="text-white/40 text-xs font-medium uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className={`h-1 w-8 rounded-full ${stat.color}`} />
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or user ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset page on search
            }}
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors">
            <HiOutlineFilter size={16} />
            Filters
            <span className="bg-[#72c043] text-[#0d0f10] text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">3</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <Table 
        columns={[
          {
            key: "user",
            label: (
              <div className="flex items-center gap-2 cursor-pointer hover:text-white/60">
                USER <HiOutlineChevronUpDown size={14} />
              </div>
            ),
            render: (user: any) => {
              const name = user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown';
              const initials = name.substring(0, 2).toUpperCase() || 'U';
              // Just a stable color generator based on ID
              const colors = ["bg-green-600/30", "bg-blue-600/30", "bg-purple-600/30", "bg-emerald-600/30", "bg-yellow-600/30", "bg-red-600/30"];
              const charCodeSum = user.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
              const color = colors[charCodeSum % colors.length];

              return (
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${color}`}>
                    {initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-sm group-hover:text-[#72c043] transition-colors">{name}</span>
                    <span className="text-white/40 text-xs">{user.email}</span>
                  </div>
                </div>
              );
            }
          },
          { 
            key: "id", 
            label: "USER ID", 
            render: (user: any) => <span className="text-sm text-white/60">...{user.id.substring(user.id.length - 8)}</span> 
          },
          { 
            key: "status", 
            label: "ACCOUNT STATUS", 
            render: (user: any) => <StatusBadge status={user.accountStatus} /> 
          },
          { 
            key: "verification", 
            label: "VERIFICATION", 
            render: (user: any) => <VerificationBadge isVerified={user.isVerified} identityVerified={user.identityVerified} /> 
          },
          { 
            key: "openToCollab", 
            label: "OPEN TO COLLAB", 
            render: (user: any) => (
              <span className={`text-sm font-medium ${user.openToCollaborate ? "text-emerald-500" : "text-white/40"}`}>
                {user.openToCollaborate ? "Yes" : "No"}
              </span>
            )
          },
          { 
            key: "plan", 
            label: "PLAN", 
            render: (user: any) => (
              <span className={`text-sm font-medium ${
                user.tier === "PRO" ? "text-purple-400" : 
                user.tier === "ELITE" ? "text-yellow-500" : 
                "text-white/40"
              }`}>
                {user.tier === "PRO" ? "Pro" : user.tier === "ELITE" ? "Elite" : "Free"}
              </span>
            )
          },
          {
            key: "dateJoined",
            label: (
              <div className="flex items-center gap-2 cursor-pointer hover:text-white/60">
                DATE JOINED <HiOutlineChevronUpDown size={14} />
              </div>
            ),
            render: (user: any) => <span className="text-sm text-white/60 whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          }
        ]}
        data={data?.users || []}
        isLoading={isLoading}
        loadingState={<div className="py-8 text-center text-white/40">Loading users...</div>}
        emptyState={<div className="py-8 text-center text-white/40">No users found</div>}
        onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
      />
        {/* Pagination */}
        <Pagination 
          currentPage={page}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
          currentItemsCount={data?.users?.length || 0}
          totalItems={stats.totalUsers}
          itemName="users"
        />
      </div>
  );
}
