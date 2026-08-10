"use client";

import React, { useState } from "react";
import { HiOutlineSearch, HiOutlineFilter } from "react-icons/hi";
import { Tabs } from "@/components/ui/Tabs";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MarketplaceReportCard, MarketplaceReportCardItem } from "./MarketplaceReportCard";
import { MarketplaceModerationModal, ModerationTarget } from "./MarketplaceModerationModal";
import { useAdminMarketplace } from "@/hooks/admin/useAdminMarketplace";

const MOCK_REPORTED_ITEMS: MarketplaceReportCardItem[] = [
  {
    id: "rep-1",
    targetId: "mkt-0412",
    targetName: "Chisom Eze",
    targetType: "profile",
    profileIdOrPostId: "MKT-0412",
    categoryOrRole: "Collaborator Profile • Songwriter / Vocalist",
    status: "Under Review",
    reason: "Fake profile — exaggerated work history/location description",
    reporterName: "Marcus Lee",
    reportedDate: "Jun 8, 2024",
  },
  {
    id: "rep-2",
    targetId: "post-103",
    targetName: "Beat Producer Needed – Hip-Hop Project",
    targetType: "posting",
    profileIdOrPostId: "POST-103",
    categoryOrRole: "Project Posting • Hip-Hop Beat Production",
    status: "Pending",
    reason: "Misleading posting — payment terms misrepresentation",
    reporterName: "Tola Adebayo",
    reportedDate: "Jul 5, 2024",
  },
  {
    id: "rep-3",
    targetId: "mkt-0814",
    targetName: "Marcus Lee",
    targetType: "profile",
    profileIdOrPostId: "MKT-0814",
    categoryOrRole: "Collaborator Profile • Producer",
    status: "Pending",
    reason: "Impersonation — using unauthorized photo and credentials",
    reporterName: "Omotola Eke",
    reportedDate: "Jul 2, 2024",
  },
  {
    id: "rep-4",
    targetId: "post-052",
    targetName: "Lo-Fi Beat Collection Collaborator",
    targetType: "posting",
    profileIdOrPostId: "POST-052",
    categoryOrRole: "Project Posting • Lo-Fi Beats",
    status: "Resolved",
    reason: "Spam posting — duplicate project listing / promotional spam",
    reporterName: "Ngozi Okafor",
    reportedDate: "Jun 28, 2024",
  },
];

export const MarketplaceReportsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All Content");
  const [activeStatus, setActiveStatus] = useState("All Statuses");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTarget, setSelectedTarget] = useState<ModerationTarget | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { moderateCollaborator, moderateProject } = useAdminMarketplace();

  const filteredItems = MOCK_REPORTED_ITEMS.filter((item) => {
    // Category filter
    if (activeCategory === "Profiles" && item.targetType !== "profile") return false;
    if (activeCategory === "Postings" && item.targetType !== "posting") return false;

    // Status filter
    if (activeStatus !== "All Statuses" && item.status !== activeStatus) return false;

    // Search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        item.targetName.toLowerCase().includes(term) ||
        item.profileIdOrPostId.toLowerCase().includes(term) ||
        item.reason.toLowerCase().includes(term) ||
        item.reporterName.toLowerCase().includes(term)
      );
    }

    return true;
  });

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
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-white/40 text-sm">
              No reported content matches your criteria.
            </div>
          ) : (
            filteredItems.map((item) => (
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
          totalPages={5}
          onPageChange={setPage}
          currentItemsCount={filteredItems.length}
          totalItems={64}
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
