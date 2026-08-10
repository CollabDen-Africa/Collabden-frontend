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

const MOCK_COLLABORATORS: CollaboratorProfileRow[] = [
  {
    id: "mkt-0412",
    name: "Chisom Eze",
    email: "chisom@gmail.com",
    profileId: "MKT-0412",
    roles: ["Songwriter", "Vocalist"],
    genres: ["R&B", "Pop"],
    location: "Enugu, NG",
    rating: 4.9,
    collabs: 38,
    status: "Reported",
  },
  {
    id: "mkt-0521",
    name: "Tola Adebayo",
    email: "tola@gmail.com",
    profileId: "MKT-0521",
    roles: ["Sound Engineer"],
    genres: ["Afrobeats"],
    location: "Lagos, NG",
    rating: 4.8,
    collabs: 14,
    status: "Active",
  },
  {
    id: "mkt-0319",
    name: "Omotola Eke",
    email: "omotola@gmail.com",
    profileId: "MKT-0319",
    roles: ["Songwriter", "Vocalist"],
    genres: ["R&B", "Pop"],
    location: "Enugu, NG",
    rating: 4.9,
    collabs: 42,
    status: "Reported",
  },
  {
    id: "mkt-0814",
    name: "Marcus Lee",
    email: "marcus@gmail.com",
    profileId: "MKT-0814",
    roles: ["Producer"],
    genres: ["Lo-Fi", "Hip-Hop"],
    location: "London, UK",
    rating: 5.0,
    collabs: 7,
    status: "Restricted",
  },
  {
    id: "mkt-0127",
    name: "Ngozi Okafor",
    email: "ngozi@gmail.com",
    profileId: "MKT-0127",
    roles: ["Vocalist", "Songwriter"],
    genres: ["Gospel", "Afrobeats"],
    location: "Lagos, NG",
    rating: 4.7,
    collabs: 19,
    status: "Active",
  },
  {
    id: "mkt-0612",
    name: "Dennis Nwosu",
    email: "dennis@gmail.com",
    profileId: "MKT-0612",
    roles: ["Mix Engineer"],
    genres: ["Afrobeats"],
    location: "Port Harcourt",
    rating: 4.1,
    collabs: 3,
    status: "Removed",
  },
  {
    id: "mkt-0718",
    name: "Yemi Ogedengbe",
    email: "yemi@gmail.com",
    profileId: "MKT-0718",
    roles: ["Producer", "Composer"],
    genres: ["Afrobeats", "Pop"],
    location: "Lagos, NG",
    rating: 4.8,
    collabs: 26,
    status: "Active",
  },
];

const MOCK_PROJECT_POSTINGS: ProjectPostingRow[] = [
  {
    id: "post-101",
    title: "Vocalist Needed for Afro-Pop Single",
    postId: "POST-101",
    ownerName: "Chisom Eze",
    requiredRoles: ["Vocalist"],
    genres: ["Afrobeats", "Pop"],
    applications: 8,
    status: "Active",
  },
  {
    id: "post-102",
    title: "Looking for Mix Engineer - Hip-Hop Track",
    postId: "POST-102",
    ownerName: "Tola Adebayo",
    requiredRoles: ["Mix Engineer"],
    genres: ["Hip-Hop"],
    applications: 11,
    status: "Active",
  },
  {
    id: "post-103",
    title: "Beat Producer Needed - R&B Album",
    postId: "POST-103",
    ownerName: "Omotola Eke",
    requiredRoles: ["Producer"],
    genres: ["R&B"],
    applications: 3,
    status: "Reported",
  },
  {
    id: "post-104",
    title: "Songwriter Collab for Acoustic EP",
    postId: "POST-104",
    ownerName: "Marcus Lee",
    requiredRoles: ["Songwriter"],
    genres: ["Acoustic", "Pop"],
    applications: 14,
    status: "Active",
  },
  {
    id: "post-105",
    title: "Lo-Fi Beats Collaboration",
    postId: "POST-105",
    ownerName: "Dennis Nwosu",
    requiredRoles: ["Producer"],
    genres: ["Lo-Fi"],
    applications: 6,
    status: "Restricted",
  },
];

export const AdminMarketplaceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Collaborator Profiles");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { overview, isLoadingOverview } = useAdminMarketplace();

  const filteredCollaborators = MOCK_COLLABORATORS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.profileId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPostings = MOCK_PROJECT_POSTINGS.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.postId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          data={activeTab === "Collaborator Profiles" ? filteredCollaborators : filteredPostings}
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
          value={overview?.totalProfiles?.toLocaleString() || "13,240"}
          color="bg-primary-green"
          isLoading={isLoadingOverview}
        />
        <StatCard
          label="Active Postings"
          value={overview?.activePostings?.toLocaleString() || "18,601"}
          color="bg-primary-green"
          isLoading={isLoadingOverview}
        />
        <StatCard
          label="Project Listings"
          value={overview?.projectListings?.toLocaleString() || "3,822"}
          color="bg-primary-blue"
          isLoading={isLoadingOverview}
        />
        <StatCard
          label="Reported Items"
          value={overview?.reportedItems?.toLocaleString() || "64"}
          color="bg-accent-red"
          isRedAlert
          isLoading={isLoadingOverview}
        />
        <StatCard
          label="Pending Review"
          value={overview?.pendingReview?.toLocaleString() || "283"}
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
            <span className="bg-primary-green text-text-main text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
              3
            </span>
          </button>
        </div>

        {/* Data Table */}
        {activeTab === "Collaborator Profiles" ? (
          <CollaboratorsTable data={filteredCollaborators} />
        ) : (
          <ProjectPostingsTable data={filteredPostings} />
        )}

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={10}
          onPageChange={setPage}
          currentItemsCount={activeTab === "Collaborator Profiles" ? filteredCollaborators.length : filteredPostings.length}
          totalItems={activeTab === "Collaborator Profiles" ? 13240 : 3822}
          itemName={activeTab === "Collaborator Profiles" ? "profiles" : "postings"}
        />
      </div>
    </div>
  );
};
