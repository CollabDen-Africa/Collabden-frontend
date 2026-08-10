"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  HiOutlineSearch, 
  HiUserAdd, 
  HiOutlineEye, 
  HiOutlinePencil, 
  HiOutlineTrash 
} from "react-icons/hi";
import { HiOutlinePower } from "react-icons/hi2";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { ExportCSVButton } from "@/components/ui/ExportCSVButton";
import { AdminRolesSubNav } from "./AdminRolesSubNav";
import { InviteAdminModal } from "./InviteAdminModal";
import { useAdminAccounts } from "@/hooks/admin/useAdminAccounts";
import { AdminAccountItem, InviteAdminPayload } from "@/services/admin/roles.service";

const getRoleBadgeStyle = (roleKey: string) => {
  switch (roleKey.toUpperCase()) {
    case "SUPER_ADMIN":
      return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
    case "SUPPORT_ADMIN":
      return "bg-primary-blue/20 text-secondary-blue border border-primary-blue/30";
    case "FINANCE_ADMIN":
      return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
    case "VERIFICATION_ADMIN":
      return "bg-purple-500/15 text-purple-400 border border-purple-500/30";
    case "MARKETPLACE_MODERATOR":
      return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30";
    default:
      return "bg-white/10 text-white/70 border border-white/15";
  }
};

export const AdminAccountsView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get("role") || undefined;

  const {
    accounts,
    allAccounts,
    isLoading,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    handleInviteAdmin,
    handleToggleStatus,
    handleDeleteAdmin,
  } = useAdminAccounts(initialRoleParam);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const breadcrumbItems = [
    { label: "Admin Portal", href: "/admin/dashboard" },
    { label: "Admin Roles", href: "/admin/roles" },
    { label: "Admin Accounts" },
  ];

  const handleFormSubmit = (payload: InviteAdminPayload) => {
    handleInviteAdmin(payload);
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in duration-300">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col gap-3">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Administrator Accounts
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Manage admin accounts, assign roles, and control portal access.
            </p>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <AdminRolesSubNav />

      {/* Search, Filter & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 w-full max-w-md">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary-green/50 transition-all"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-auto bg-white/5 border border-white/10 text-white/70 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary-green/50 cursor-pointer"
          >
            <option value="ALL" className="bg-[#0d0f10]">All Roles</option>
            <option value="SUPER_ADMIN" className="bg-[#0d0f10]">Super Admin</option>
            <option value="SUPPORT_ADMIN" className="bg-[#0d0f10]">Support Admin</option>
            <option value="FINANCE_ADMIN" className="bg-[#0d0f10]">Finance Admin</option>
            <option value="VERIFICATION_ADMIN" className="bg-[#0d0f10]">Verification Admin</option>
            <option value="MARKETPLACE_MODERATOR" className="bg-[#0d0f10]">Marketplace Moderator</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-white/5 border border-white/10 text-white/70 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary-green/50 cursor-pointer"
          >
            <option value="ALL" className="bg-[#0d0f10]">All Statuses</option>
            <option value="ACTIVE" className="bg-[#0d0f10]">Active</option>
            <option value="INACTIVE" className="bg-[#0d0f10]">Inactive</option>
          </select>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <ExportCSVButton
            data={accounts}
            filename="collabden-admins.csv"
            headers={[
              { label: "ID", key: "id" },
              { label: "First Name", key: "firstName" },
              { label: "Last Name", key: "lastName" },
              { label: "Email", key: "email" },
              { label: "Role", key: "roleName" },
              { label: "Status", key: "status" },
              { label: "Date Added", key: "dateAdded" },
            ]}
          />

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#72c043] text-[#0d0f10] font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-md cursor-pointer shrink-0"
          >
            <HiUserAdd size={18} />
            <span>Invite Admin</span>
          </button>
        </div>
      </div>

      {/* Main Accounts Table */}
      <Table
        columns={[
          {
            key: "administrator",
            label: "ADMINISTRATOR",
            render: (acc: AdminAccountItem) => (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {acc.initials}
                </div>
                <span className="text-white font-semibold text-sm">
                  {acc.firstName} {acc.lastName}
                </span>
              </div>
            ),
          },
          {
            key: "email",
            label: "EMAIL",
            render: (acc: AdminAccountItem) => (
              <span className="text-sm text-white/70 font-mono">{acc.email}</span>
            ),
          },
          {
            key: "role",
            label: "ROLE",
            render: (acc: AdminAccountItem) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleBadgeStyle(acc.roleKey)}`}>
                {acc.roleName}
              </span>
            ),
          },
          {
            key: "status",
            label: "STATUS",
            render: (acc: AdminAccountItem) => (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                acc.status === "Active"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-white/10 text-white/50 border border-white/10"
              }`}>
                {acc.status}
              </span>
            ),
          },
          {
            key: "dateAdded",
            label: "DATE ADDED",
            render: (acc: AdminAccountItem) => (
              <span className="text-sm text-white/50">{acc.dateAdded}</span>
            ),
          },
          {
            key: "actions",
            label: "ACTIONS",
            render: (acc: AdminAccountItem) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/admin/roles/${acc.roleKey.toLowerCase()}/edit`)}
                  title="View Details"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <HiOutlineEye size={15} />
                </button>
                <button
                  onClick={() => router.push(`/admin/roles/${acc.roleKey.toLowerCase()}/edit`)}
                  title="Edit Admin"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <HiOutlinePencil size={14} />
                </button>
                <button
                  onClick={() => handleToggleStatus(acc.id)}
                  title={acc.status === "Active" ? "Deactivate" : "Activate"}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <HiOutlinePower size={15} />
                </button>
                <button
                  onClick={() => handleDeleteAdmin(acc.id)}
                  title="Remove Admin"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  <HiOutlineTrash size={15} />
                </button>
              </div>
            ),
          },
        ]}
        data={accounts}
        isLoading={isLoading}
        loadingState={<div className="py-8 text-center text-white/40">Loading administrators...</div>}
        emptyState={<div className="py-8 text-center text-white/40">No administrator accounts found.</div>}
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(allAccounts.length / 10) || 1}
        onPageChange={setPage}
        currentItemsCount={accounts.length}
        totalItems={allAccounts.length}
        itemName="administrators"
      />

      {/* Invite Admin Modal */}
      <InviteAdminModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default AdminAccountsView;
