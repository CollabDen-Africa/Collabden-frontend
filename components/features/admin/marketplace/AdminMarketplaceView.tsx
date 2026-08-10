"use client";

import React, { useState } from "react";
import { HiOutlineSearch, HiOutlineFilter } from "react-icons/hi";
import { useAdminMarketplace } from "@/hooks/admin/useAdminMarketplace";
import { ExportCSVButton } from "@/components/ui/ExportCSVButton";
import { StatCard } from "@/components/features/admin/shared/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import { Pagination } from "@/components/ui/Pagination";
import { CollaboratorsTable, CollaboratorProfileRow } from "./CollaboratorsTable";
import { ProjectPostingsTable, ProjectPostingRow } from "./ProjectPostingsTable";

export const AdminMarketplaceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Collaborator Profiles");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    overview,
    isLoadingOverview,
    collaborators,
    collaboratorsTotal,
    isLoadingCollaborators,
    postings,
    postingsTotal,
    isLoadingPostings,
  } = useAdminMarketplace({ page, limit, search: searchTerm || undefined });

  // Map API response data cleanly
  const collaboratorRows: CollaboratorProfileRow[] = Array.isArray(collaborators)
    ? collaborators.map((c: any) => ({
        id: c.id || c._id,
        name: c.displayName || `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.name || "Collaborator",
        email: c.email || "user@collabden.com",
        profileId: c.profileId || `MKT-${c.id?.slice(-4) || '0000'}`,
        roles: Array.isArray(c.roles) ? c.roles : [c.role || "Collaborator"],
        genres: Array.isArray(c.genres) ? c.genres : ["Afrobeats"],
        location: c.location || "Lagos, NG",
        rating: c.rating || 4.8,
        collabs: c.collabsCount || c.totalCollaborations || 0,
        status: c.status === "REPORTED" ? "Reported" : c.status === "RESTRICTED" ? "Restricted" : c.status === "REMOVED" ? "Removed" : "Active",
      }))
    : [];

  const postingRows: ProjectPostingRow[] = Array.isArray(postings)
    ? postings.map((p: any) => ({
        id: p.id || p._id,
        title: p.title || "Untitled Project",
        postId: p.postId || `POST-${p.id?.slice(-3) || '000'}`,
        ownerName: p.ownerName || p.user?.displayName || "Project Owner",
        requiredRoles: Array.isArray(p.requiredRoles) ? p.requiredRoles : ["Producer"],
        genres: Array.isArray(p.genres) ? p.genres : ["Pop"],
        applications: p.applicationsCount || p.applications?.length || 0,
        status: p.status === "REPORTED" ? "Reported" : p.status === "RESTRICTED" ? "Restricted" : p.status === "CLOSED" ? "Closed" : "Active",
      }))
    : [];

  return (
    <div className="w-full flex flex-col gap-8 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
            Marketplace Management
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Review collaborator profiles and project listings across the marketplace.
          </p>
        </div>
        <ExportCSVButton
          data={activeTab === "Collaborator Profiles" ? collaboratorRows : postingRows}
          filename={`marketplace-${activeTab.toLowerCase().replace(/\s+/g, "-")}.csv`}
          headers={
            activeTab === "Collaborator Profiles"
              ? [
                  { label: "Profile ID", key: "profileId" },
                  { label: "Name", key: "name" },
                  { label: "Email", key: "email" },
                  { label: "Location", key: "location" },
                  { label: "Rating", key: "rating" },
                  { label: "Collabs", key: "collabs" },
                  { label: "Status", key: "status" },
                ]
              : [
                  { label: "Post ID", key: "postId" },
                  { label: "Title", key: "title" },
                  { label: "Owner", key: "ownerName" },
                  { label: "Applications", key: "applications" },
                  { label: "Status", key: "status" },
                ]
          }
        />
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Profiles"
          value={overview?.totalProfiles?.toLocaleString() || overview?.profilesCount?.toLocaleString() || "0"}
          color="bg-primary-green"
          isLoading={isLoadingOverview}
        />
        <StatCard
          label="Active Postings"
          value={overview?.activePostings?.toLocaleString() || overview?.activeCount?.toLocaleString() || "0"}
          color="bg-primary-green"
          isLoading={isLoadingOverview}
        />
        <StatCard
          label="Project Listings"
          value={overview?.projectListings?.toLocaleString() || overview?.listingsCount?.toLocaleString() || "0"}
          color="bg-primary-blue"
          isLoading={isLoadingOverview}
        />
        <StatCard
          label="Reported Items"
          value={overview?.reportedItems?.toLocaleString() || overview?.reportedCount?.toLocaleString() || "0"}
          color="bg-accent-red"
          isRedAlert
          isLoading={isLoadingOverview}
        />
        <StatCard
          label="Pending Review"
          value={overview?.pendingReview?.toLocaleString() || overview?.pendingCount?.toLocaleString() || "0"}
          color="bg-accent-yellow"
          isLoading={isLoadingOverview}
        />
      </div>

      {/* Sub-Nav Tabs & Search */}
      <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
        <Tabs
          tabs={["Collaborator Profiles", "Project Postings"]}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setPage(1);
          }}
        />

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 pt-2">
          <div className="relative flex-1 w-full">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder={
                activeTab === "Collaborator Profiles"
                  ? "Search by name, profile ID, or email..."
                  : "Search project postings..."
              }
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-green transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors shrink-0">
            <HiOutlineFilter size={16} />
            Filters
          </button>
        </div>

        {/* Real-time Data Table */}
        {activeTab === "Collaborator Profiles" ? (
          <CollaboratorsTable data={collaboratorRows} isLoading={isLoadingCollaborators} />
        ) : (
          <ProjectPostingsTable data={postingRows} isLoading={isLoadingPostings} />
        )}

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={Math.ceil((activeTab === "Collaborator Profiles" ? collaboratorsTotal : postingsTotal) / limit) || 1}
          onPageChange={setPage}
          currentItemsCount={activeTab === "Collaborator Profiles" ? collaboratorRows.length : postingRows.length}
          totalItems={activeTab === "Collaborator Profiles" ? collaboratorsTotal : postingsTotal}
          itemName={activeTab === "Collaborator Profiles" ? "profiles" : "postings"}
        />
      </div>
    </div>
  );
};
