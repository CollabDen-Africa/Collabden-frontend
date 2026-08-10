"use client";

import React, { useState } from "react";
import { HiOutlineFlag, HiOutlineClock } from "react-icons/hi";
import { FiEye, FiTrash2, FiPlus } from "react-icons/fi";
import { useProjectReports, useUpdateProjectReportStatus } from "@/hooks/admin/useProjectReports";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { HiOutlineSearch } from "react-icons/hi";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Pagination } from "@/components/ui/Pagination";

const tabs = ["All", "Pending", "Under Review", "Resolved"];

export const ReportedProjectsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading } = useProjectReports({
    page,
    limit,
    status: activeTab,
    search: debouncedSearchTerm || undefined,
  });
  
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateProjectReportStatus();

  const handleUpdateStatus = (reportId: string, projectId: string, newStatus: string) => {
    updateStatus(
      { reportId, projectId, status: newStatus },
      {
        onSuccess: () => alert(`Report status updated to ${newStatus}`),
        onError: () => alert("Failed to update report status"),
      }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">Pending</span>;
      case "REVIEWED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">Under Review</span>;
      case "ACTION_TAKEN":
      case "DISMISSED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">Resolved</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const breadcrumbs = [
    { label: "Admin Portal" },
    { label: "Projects", href: "/admin/projects" },
    { label: "Reported Projects", href: "/admin/projects/reports" },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <Breadcrumbs items={breadcrumbs} />

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Reported Projects</h1>
            <p className="text-white/40 text-sm mt-1">Review policy violation reports submitted against projects.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white/2 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 focus:bg-white/4 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-[#72c043] text-[#111111]"
                  : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="py-12 text-center text-white/40">Loading reports...</div>
        ) : data?.reports?.length === 0 ? (
          <div className="py-12 text-center text-white/40 border border-white/5 bg-white/2 rounded-2xl">
            No reports found for this filter.
          </div>
        ) : (
          data?.reports?.map((report: any) => (
            <div key={report.id} className="bg-white/2 border border-white/5 rounded-2xl p-5 flex flex-col gap-5 hover:bg-white/4 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-semibold text-[#72c043] bg-[#72c043]/10 border border-[#72c043]/20 shrink-0">
                    🎵
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-semibold text-lg">{report.project?.name || "Unknown Project"}</h3>
                      <span className="text-white/40 text-xs">...{(report.project?.id || "N/A").slice(-8)}</span>
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <HiOutlineFlag className="text-[#f87171]" size={14} />
                      <span className="text-white/80">{report.reason}</span>
                      <span>—</span>
                      <span>{report.description}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm text-white/60">
                    Reported by <span className="text-white font-medium">{report.reporter?.displayName || "Unknown"}</span>
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <HiOutlineClock size={12} />
                    {formatDate(report.createdAt)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => router.push(`/admin/projects/${report.projectId}`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#72c043]/30 bg-[#72c043]/10 text-[#72c043] text-sm font-medium hover:bg-[#72c043]/20 transition-colors"
                  >
                    <FiEye size={14} />
                    Review Project
                  </button>
                  <button 
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/5 text-red-500 text-sm font-medium hover:bg-red-500/10 transition-colors"
                  >
                    <FiTrash2 size={14} />
                    Remove Project
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <FiPlus size={14} />
                    Add Note
                  </button>
                  <div className="flex items-center gap-2">
                     <select 
                        value={report.status}
                        onChange={(e) => handleUpdateStatus(report.id, report.projectId, e.target.value)}
                        disabled={isUpdating}
                        className="bg-transparent border-none text-white/40 text-sm focus:outline-none focus:ring-0 cursor-pointer"
                      >
                        <option value="OPEN" className="bg-[#111111] text-white">Mark Pending</option>
                        <option value="REVIEWED" className="bg-[#111111] text-white">Mark Under Review</option>
                        <option value="ACTION_TAKEN" className="bg-[#111111] text-white">Mark Resolved (Action Taken)</option>
                        <option value="DISMISSED" className="bg-[#111111] text-white">Mark Resolved (Dismissed)</option>
                     </select>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {data?.totalPages > 1 && (
        <Pagination 
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
          currentItemsCount={data.reports?.length || 0}
          totalItems={data.total}
          itemName="reports"
        />
      )}
    </div>
  );
};
