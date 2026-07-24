import React, { useState } from "react";
import { useUserReports } from "@/hooks/admin/useUserReports";
import { Table } from "@/components/ui/Table";
import { FilterRow } from "@/components/ui/FilterRow";
import { Pagination } from "@/components/ui/Pagination";
import {
  HiOutlineExclamationCircle,
  HiOutlineShieldExclamation,
  HiOutlineFlag,
  HiOutlineSpeakerphone,
} from "react-icons/hi";

export const UserReports: React.FC<{ userId: string }> = ({ userId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useUserReports({
    id: userId,
    page,
    limit: 10,
    search: searchQuery,
    type: activeFilter,
  });

  const getIconForAction = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes("spam")) return { icon: <HiOutlineSpeakerphone size={16} className="text-yellow-500" />, bg: "bg-yellow-500/10", color: "bg-yellow-500/10 text-yellow-500", type: "Spam" };
    if (actionLower.includes("harassment")) return { icon: <HiOutlineShieldExclamation size={16} className="text-red-500" />, bg: "bg-red-500/10", color: "bg-red-500/10 text-red-500", type: "Harassment" };
    if (actionLower.includes("scam")) return { icon: <HiOutlineExclamationCircle size={16} className="text-orange-500" />, bg: "bg-orange-500/10", color: "bg-orange-500/10 text-orange-500", type: "Scam" };
    return { icon: <HiOutlineFlag size={16} className="text-gray-500" />, bg: "bg-gray-500/10", color: "bg-gray-500/10 text-gray-500", type: "General" };
  };

  const reportsData = data?.reports?.map((report: any) => {
    const actionText = report.reason || report.action || report.description || "general";
    const styling = getIconForAction(actionText);
    const d = new Date(report.createdAt);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    
    return {
      id: report.id,
      type: styling.type,
      description: report.description || report.reason || report.action || "Report submitted",
      date: `${dateStr} · ${timeStr}`,
      icon: styling.icon,
      iconBg: styling.bg,
      badgeColor: styling.color,
    };
  }) || [];

  return (
    <div className="p-6 md:p-8 bg-[#0a0a0c]">
      {/* Filters Row */}
      <FilterRow 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search reports..."
        filters={["All", "Spam", "Harassment", "Scam"]}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="bg-[#121415] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white">Reports History</h3>
          <span className="text-xs text-white/40">Read-only · {data?.total || 0} total reports</span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-white/40">Loading reports...</div>
        ) : reportsData.length === 0 ? (
          <div className="p-8 text-center text-white/40">No reports found.</div>
        ) : (
          <Table
            showHeader={false}
            data={reportsData}
          columns={[
            {
              key: "report",
              render: (item) => (
                <div className="flex items-center gap-4 py-1">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.iconBg}`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-sm text-white/80">{item.description}</span>
                </div>
              ),
            },
            {
              key: "badge",
              render: (item) => (
                <div className="flex justify-end">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${item.badgeColor}`}
                  >
                    {item.type}
                  </span>
                </div>
              ),
            },
            {
              key: "date",
              render: (item) => (
                <div className="text-right text-xs text-white/40 whitespace-nowrap w-32">
                  {item.date}
                </div>
              ),
            }
          ]}
        />
        )}

        {data?.totalPages > 1 && (
          <Pagination 
            currentPage={page}
            totalPages={data?.totalPages || 1}
            onPageChange={setPage}
            itemName="reports"
          />
        )}
      </div>
    </div>
  );
};
