import React, { useState } from "react";
import { useUserActivity } from "@/hooks/admin/useUserActivity";
import { Table } from "@/components/ui/Table";
import { FilterRow } from "@/components/ui/FilterRow";
import { Pagination } from "@/components/ui/Pagination";
import {
  HiOutlineLogin,
  HiOutlineMusicNote,
  HiOutlineUserGroup,
  HiOutlineCreditCard,
  HiOutlineBadgeCheck,
  HiOutlineStar,
} from "react-icons/hi";

export const UserActivity: React.FC<{ userId: string }> = ({ userId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useUserActivity({
    id: userId,
    page,
    limit: 10,
    search: searchQuery,
    type: activeFilter,
  });

  const getIconForAction = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes("login")) return { icon: <HiOutlineLogin size={16} className="text-emerald-500" />, bg: "bg-emerald-500/10", color: "bg-emerald-500/10 text-emerald-500", type: "Login" };
    if (actionLower.includes("project")) return { icon: <HiOutlineMusicNote size={16} className="text-blue-500" />, bg: "bg-blue-500/10", color: "bg-blue-500/10 text-blue-500", type: "Project" };
    if (actionLower.includes("payment")) return { icon: <HiOutlineCreditCard size={16} className="text-emerald-500" />, bg: "bg-emerald-500/10", color: "bg-emerald-500/10 text-emerald-500", type: "Payment" };
    if (actionLower.includes("verif")) return { icon: <HiOutlineBadgeCheck size={16} className="text-green-500" />, bg: "bg-green-500/10", color: "bg-green-500/10 text-green-500", type: "Verification" };
    if (actionLower.includes("collab")) return { icon: <HiOutlineUserGroup size={16} className="text-purple-500" />, bg: "bg-purple-500/10", color: "bg-purple-500/10 text-purple-500", type: "Collab" };
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
      description: activity.action,
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
        searchPlaceholder="Search activity..."
        filters={["All", "Login", "Project", "Payment", "Marketplace", "Verification"]}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="bg-[#121415] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white">Activity History</h3>
          <span className="text-xs text-white/40">Read-only · {data?.total || 0} total events</span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-white/40">Loading activity...</div>
        ) : activityData.length === 0 ? (
          <div className="p-8 text-center text-white/40">No activity found.</div>
        ) : (
          <Table
            showHeader={false}
            data={activityData}
          columns={[
            {
              key: "activity",
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
            itemName="activities"
          />
        )}
      </div>
    </div>
  );
};
