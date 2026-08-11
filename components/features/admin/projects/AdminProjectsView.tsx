"use client";

import React, { useState } from "react";
import { 
  HiOutlineSearch, 
  HiOutlineFilter,
} from "react-icons/hi";
import { HiOutlineChevronUpDown } from "react-icons/hi2";
import { useProjects } from "@/hooks/admin/useProjects";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { ExportCSVButton } from "@/components/ui/ExportCSVButton";
import EmptyState from "@/components/ui/EmptyState";
import { HiOutlineFolderOpen } from "react-icons/hi";

const StatusBadge = ({ status, isDeleted }: { status: string, isDeleted?: boolean }) => {
  if (isDeleted) {
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400">
        Archived
      </span>
    );
  }

  const colors: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-500",
    COMPLETED: "bg-blue-500/10 text-blue-500",
  };
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-500/10 text-gray-400"}`}>
      {displayStatus}
    </span>
  );
};

export const AdminProjectsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useProjects({
    page,
    limit,
    search: debouncedSearchTerm || undefined,
  });
  const router = useRouter();

  const stats = data?.stats || {
    totalProjects: 0,
    active: 0,
    completed: 0,
    archived: 0,
  };

  const statCards = [
    { label: "Total Projects", value: stats.totalProjects.toLocaleString(), color: "bg-[#72c043]" },
    { label: "Active", value: stats.active.toLocaleString(), color: "bg-[#72c043]" },
    { label: "Completed", value: stats.completed.toLocaleString(), color: "bg-[#72c043]" },
    { label: "Archived", value: stats.archived.toLocaleString(), color: "bg-[#72c043]" },
  ];

  return (
    <div className="w-full flex flex-col gap-8 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Project Management</h1>
          <p className="text-white/40 text-sm mt-1">Monitor, search, and manage all projects on the platform.</p>
        </div>
        <ExportCSVButton 
          data={data?.projects || []} 
          filename="collabden-projects.csv"
          headers={[
            { label: "ID", key: "id" },
            { label: "Name", key: "name" },
            { label: "Genre", key: "genre" },
            { label: "Status", key: "status" },
            { label: "Visibility", key: "visibility" },
            { label: "Created", key: "createdAt" },
          ]}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white/2 border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
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
            placeholder="Search by name, description, or project ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full bg-white/2 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 focus:bg-white/4 transition-all"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => router.push('/admin/projects/reports')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium transition-colors"
          >
            Reported Projects
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors">
            <HiOutlineFilter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* Table Container */}
      <Table 
        columns={[
          {
            key: "project",
            label: (
              <div className="flex items-center gap-2 cursor-pointer hover:text-white/60">
                PROJECT <HiOutlineChevronUpDown size={14} />
              </div>
            ),
            render: (project: any) => {
              return (
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold text-[#72c043] bg-[#72c043]/10 border border-[#72c043]/20`}>
                    🎵
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-sm group-hover:text-[#72c043] transition-colors">{project.name}</span>
                    <span className="text-white/40 text-xs">{project.genre}</span>
                  </div>
                </div>
              );
            }
          },
          { 
            key: "id", 
            label: "PROJECT ID", 
            render: (project: any) => <span className="text-sm text-white/60">...{project.id.substring(project.id.length - 8)}</span> 
          },
          {
            key: "owner",
            label: "OWNER",
            render: (project: any) => {
              const owner = project.owner;
              const name = owner?.displayName || `${owner?.firstName || ''} ${owner?.lastName || ''}`.trim() || 'Unknown';
              const initials = name.substring(0, 2).toUpperCase() || 'U';
              
              return (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#72c043]/20 flex items-center justify-center text-[10px] font-semibold text-[#72c043]">
                    {initials}
                  </div>
                  <span className="text-sm text-white/80">{name}</span>
                </div>
              );
            }
          },
          { 
            key: "status", 
            label: "STATUS", 
            render: (project: any) => <StatusBadge status={project.status} isDeleted={project.isDeleted} /> 
          },
          { 
            key: "visibility", 
            label: "VISIBILITY", 
            render: (project: any) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-white/60`}>
                {project.visibility.charAt(0).toUpperCase() + project.visibility.slice(1).toLowerCase()}
              </span>
            )
          },
          { 
            key: "collaborators", 
            label: "COLLABORATORS", 
            render: (project: any) => (
              <span className="text-sm text-white font-medium">
                {project._count?.collaborators || 1}
              </span>
            )
          },
          {
            key: "dateCreated",
            label: (
              <div className="flex items-center gap-2 cursor-pointer hover:text-white/60">
                DATE CREATED <HiOutlineChevronUpDown size={14} />
              </div>
            ),
            render: (project: any) => <span className="text-sm text-white/60 whitespace-nowrap">{new Date(project.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          }
        ]}
        data={data?.projects || []}
        isLoading={isLoading}
        loadingState={<div className="py-8 text-center text-white/40">Loading projects...</div>}
        emptyState={
          <div className="py-6 px-4">
            <EmptyState
              icon={<HiOutlineFolderOpen size={36} />}
              title="No Projects Found"
              description="No projects match your current search criteria or filter options."
              actionLabel="Clear Search"
              onAction={() => { setSearchTerm(""); setPage(1); }}
            />
          </div>
        }
        onRowClick={(project) => router.push(`/admin/projects/${project.id}`)}
      />

      <Pagination 
        currentPage={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
        currentItemsCount={data?.projects?.length || 0}
        totalItems={stats.totalProjects}
        itemName="projects"
      />
    </div>
  );
};

export default AdminProjectsView;
