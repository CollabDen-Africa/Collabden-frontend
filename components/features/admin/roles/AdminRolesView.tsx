"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineSearch, HiPlus } from "react-icons/hi";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import EmptyState from "@/components/ui/EmptyState";
import { AdminRolesSubNav } from "./AdminRolesSubNav";
import { RoleCard } from "./RoleCard";
import { CreateRoleModal } from "./CreateRoleModal";
import { RoleDetailsModal } from "./RoleDetailsModal";
import { useAdminRoles } from "@/hooks/admin/useAdminRoles";
import { AdminRoleItem, CreateRolePayload } from "@/services/admin/roles.service";

export const AdminRolesView: React.FC = () => {
  const router = useRouter();
  const {
    roles,
    stats,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    handleCreateRole,
    handleToggleRoleStatus,
  } = useAdminRoles();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRoleForView, setSelectedRoleForView] = useState<AdminRoleItem | null>(null);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<AdminRoleItem | null>(null);

  const breadcrumbItems = [
    { label: "Admin Portal", href: "/admin/dashboard" },
    { label: "Admin Roles" },
    { label: "Roles" },
  ];

  const statCards = [
    { label: "Total Roles", value: stats.totalRoles, color: "bg-[#72c043]", onClick: undefined },
    { 
      label: "Total Admins", 
      value: stats.totalAdmins, 
      color: "bg-[#204F99]", 
      onClick: () => router.push("/admin/roles/accounts") 
    },
    { label: "Active Roles", value: stats.activeRoles, color: "bg-[#72c043]", onClick: undefined },
    { label: "Inactive Roles", value: stats.inactiveRoles, color: "bg-[#FBBC04]", onClick: undefined },
  ];

  const handleOpenEdit = (role: AdminRoleItem) => {
    router.push(`/admin/roles/${role.id}/edit`);
  };

  const handleFormSubmit = (payload: CreateRolePayload) => {
    handleCreateRole(payload);
    setSelectedRoleForEdit(null);
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in duration-300">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col gap-3">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Admin Roles & Permissions
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Manage administrator roles, assigned permissions, and access levels.
            </p>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <AdminRolesSubNav />

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div 
            key={idx} 
            onClick={stat.onClick}
            className={`bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm transition-all ${
              stat.onClick ? "cursor-pointer hover:bg-white/10 hover:border-white/20" : ""
            }`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {isLoading ? "..." : stat.value}
              </span>
              <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <div className={`h-1 w-10 rounded-full ${stat.color}`} />
          </div>
        ))}
      </div>

      {/* Search, Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 w-full max-w-md">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary-green/50 transition-all"
            />
          </div>

          {/* Status Select Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto bg-white/5 border border-white/10 text-white/70 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary-green/50 cursor-pointer"
            >
              <option value="ALL" className="bg-[#0d0f10] text-white">All Statuses</option>
              <option value="ACTIVE" className="bg-[#0d0f10] text-white">Active Only</option>
              <option value="INACTIVE" className="bg-[#0d0f10] text-white">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => {
            setSelectedRoleForEdit(null);
            setIsCreateModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-[#72c043] text-[#0d0f10] font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shrink-0 cursor-pointer"
        >
          <HiPlus size={18} />
          <span>Create New Role</span>
        </button>
      </div>

      {/* Roles Cards List */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="py-16 text-center text-white/40 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading admin roles...</span>
          </div>
        ) : roles.length > 0 ? (
          roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onView={(r) => setSelectedRoleForView(r)}
              onEdit={(r) => handleOpenEdit(r)}
              onToggleStatus={handleToggleRoleStatus}
            />
          ))
        ) : (
          <EmptyState
            icon={<HiOutlineSearch size={36} />}
            title="No Matching Roles Found"
            description="No admin roles match your current search query or applied status filter."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
            }}
          />
        )}
      </div>

      {/* Create Role Modal */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedRoleForEdit(null);
        }}
        onSubmit={handleFormSubmit}
        initialRole={selectedRoleForEdit}
      />

      {/* Role Details Modal */}
      <RoleDetailsModal
        role={selectedRoleForView}
        onClose={() => setSelectedRoleForView(null)}
        onEdit={(role) => handleOpenEdit(role)}
      />
    </div>
  );
};

export default AdminRolesView;
