"use client";

import React, { useState } from "react";
import { HiOutlineSearch, HiOutlineShieldExclamation } from "react-icons/hi";
import { Tabs } from "@/components/ui/Tabs";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import EmptyState from "@/components/ui/EmptyState";
import { MarketplaceReportCard, MarketplaceReportCardItem } from "./MarketplaceReportCard";
import { MarketplaceModerationModal, ModerationTarget } from "./MarketplaceModerationModal";
import { useAdminMarketplace } from "@/hooks/admin/useAdminMarketplace";

export const MarketplaceReportsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All Content");
  const [activeStatus, setActiveStatus] = useState("All Statuses");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedTarget, setSelectedTarget] = useState<ModerationTarget | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    reports,
    reportsTotal,
    isLoadingReports,
    moderateCollaborator,
    moderateProject,
  } = useAdminMarketplace({
    page,
    limit,
    category: activeCategory !== "All Content" ? activeCategory.toLowerCase() : undefined,
    status: activeStatus !== "All Statuses" ? activeStatus.toLowerCase().replace(/\s+/g, "_") : undefined,
    search: searchTerm || undefined,
  });

  const reportItems: MarketplaceReportCardItem[] = Array.isArray(reports)
    ? reports.map((r: any) => ({
        id: r.id || r._id,
        targetId: r.targetId || r.contentId || r.id,
        targetName: r.targetName || r.title || r.user?.displayName || "Reported Item",
        targetType: r.targetType === "posting" || r.contentType === "posting" ? "posting" : "profile",
        profileIdOrPostId: r.profileId || r.postId || `REF-${r.id?.slice(-4) || '0000'}`,
        categoryOrRole: r.categoryOrRole || `${r.targetType === "posting" ? "Project Posting" : "Collaborator Profile"}`,
        status: r.status === "RESOLVED" ? "Resolved" : r.status === "UNDER_REVIEW" ? "Under Review" : "Pending",
        reason: r.reason || r.description || "Violation of marketplace guidelines",
        reporterName: r.reporterName || r.reporter?.displayName || "Platform User",
        reportedDate: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently",
      }))
    : [];

  const handleModerateOpen = (item: MarketplaceReportCardItem) => {
    setSelectedTarget({
      id: item.targetId,
      name: item.targetName,
      type: item.targetType,
      profileIdOrPostId: item.profileIdOrPostId,
      rolesOrCategory: item.categoryOrRole,
      currentStatus: item.status,
    });
    setIsModalOpen(true);
  };

  const handleConfirmModeration = async (payload: { action: string; reason: string }) => {
    if (!selectedTarget) return;
    if (selectedTarget.type === "profile") {
      await moderateCollaborator({ id: selectedTarget.id, action: payload.action, reason: payload.reason });
    } else {
      await moderateProject({ id: selectedTarget.id, action: payload.action, reason: payload.reason });
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumb Trail */}
      <Breadcrumbs
        items={[
          { label: "Admin Portal" },
          { label: "Marketplace", href: "/admin/marketplace" },
          { label: "Reported Content" },
        ]}
      />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
            Reported Marketplace Content
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Review user reports submitted against profiles and project listings across the marketplace.
          </p>
        </div>
      </div>

      {/* Category Tabs & Filter Control Bar */}
      <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-5">
        <Tabs
          tabs={["All Content", "Profiles", "Postings"]}
          activeTab={activeCategory}
          onTabChange={(category) => {
            setActiveCategory(category);
            setPage(1);
          }}
        />

        {/* Search & Status Pill Filters Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md w-full">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search reports by title, ID, or reason..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-green transition-colors"
            />
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {["All Statuses", "Pending", "Under Review", "Resolved"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setActiveStatus(status);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  activeStatus === status
                    ? "bg-primary-green text-text-main border-primary-green"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Reported Content Cards Stack */}
        <div className="flex flex-col gap-4 mt-2">
          {isLoadingReports ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-white/40 text-sm">
              <div className="w-6 h-6 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
              <span>Loading marketplace reports...</span>
            </div>
          ) : reportItems.length === 0 ? (
            <EmptyState
              icon={<HiOutlineShieldExclamation size={36} />}
              title="No Reported Content Found"
              description="No user reports match your selected category or status criteria."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchTerm("");
                setActiveCategory("All Content");
                setActiveStatus("All Statuses");
              }}
            />
          ) : (
            reportItems.map((item) => (
              <MarketplaceReportCard
                key={item.id}
                item={item}
                onModerate={handleModerateOpen}
                onAddNote={handleModerateOpen}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(reportsTotal / limit) || 1}
          onPageChange={setPage}
          currentItemsCount={reportItems.length}
          totalItems={reportsTotal}
          itemName="reports"
        />
      </div>

      {/* Moderation Action Modal */}
      <MarketplaceModerationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        target={selectedTarget}
        onConfirm={handleConfirmModeration}
      />
    </div>
  );
};
