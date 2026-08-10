import React, { useState } from "react";
import { useProjectActivity } from "@/hooks/admin/useProjectActivity";
import { Table } from "@/components/ui/Table";
import { FilterRow } from "@/components/ui/FilterRow";
import { Pagination } from "@/components/ui/Pagination";
import {
  HiOutlineMusicNote,
  HiOutlineUserGroup,
  HiOutlineFolder,
  HiOutlineDocumentText,
  HiOutlineStar,
} from "react-icons/hi";

export const ProjectActivity: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useProjectActivity({
    id: projectId,
    page,
    limit: 10,
    search: searchQuery,
    type: activeFilter,
  });

  const getIconForAction = (action: string) => {
    const actionLower = action?.toLowerCase() || "";
    if (actionLower.includes("file") || actionLower.includes("upload")) return { icon: <HiOutlineFolder size={16} className="text-[#72c043]" />, bg: "bg-[#72c043]/10", color: "bg-[#72c043]/10 text-[#72c043]", type: "File" };
    if (actionLower.includes("task")) return { icon: <HiOutlineDocumentText size={16} className="text-blue-500" />, bg: "bg-blue-500/10", color: "bg-blue-500/10 text-blue-500", type: "Task" };
    if (actionLower.includes("collab") || actionLower.includes("join")) return { icon: <HiOutlineUserGroup size={16} className="text-purple-500" />, bg: "bg-purple-500/10", color: "bg-purple-500/10 text-purple-500", type: "Collab" };
    if (actionLower.includes("music") || actionLower.includes("audio")) return { icon: <HiOutlineMusicNote size={16} className="text-pink-500" />, bg: "bg-pink-500/10", color: "bg-pink-500/10 text-pink-500", type: "Audio" };
    return { icon: <HiOutlineStar size={16} className="text-gray-500" />, bg: "bg-gray-500/10", color: "bg-gray-500/10 text-gray-500", type: "General" };
  };

  const activityData = data?.activities?.map((activity: any) => {
    const styling = getIconForAction(activity.action);
    const d = new Date(activity.createdAt);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    
    return {
      id: activity.id,
      type: styling.type,
      description: activity.action || "Unknown action",
      details: activity.details,
      date: `${dateStr} · ${timeStr}`,
      icon: styling.icon,
      iconBg: styling.bg,
      badgeColor: styling.color,
    };
  }) || [];

  return (
    <div className="p-6 md:p-8 bg-[#0a0a0c]">
      <FilterRow 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search project activity..."
        filters={["All", "Task", "File", "Collab", "Audio"]}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="bg-[#121415] border border-white/5 rounded-2xl overflow-hidden mt-6">
        <div className="p-5 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white">Activity Log</h3>
          <span className="text-xs text-white/40">Read-only · {data?.total || 0} total events</span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-white/40">Loading activity...</div>
        ) : activityData.length === 0 ? (
          <div className="p-8 text-center text-white/40">No activity found for this project.</div>
        ) : (
          <Table
            showHeader={false}
            data={activityData}
            columns={[
              {
                key: "activity",
                render: (item) => (
                  <div className="flex items-center gap-4 py-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                      {item.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-white/80">{item.description}</span>
                      {item.details && <span className="text-xs text-white/40">{item.details}</span>}
                    </div>
                  </div>
                ),
              },
              {
                key: "badge",
                render: (item) => (
                  <div className="flex justify-end">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${item.badgeColor}`}>
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
            itemName="activities"
          />
        )}
      </div>
    </div>
  );
};
