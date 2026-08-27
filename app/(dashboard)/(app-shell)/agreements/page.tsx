"use client";

import React, { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import { FiSearch, FiFileText } from "react-icons/fi";
import AgreementCard, { AgreementData } from "@/components/features/dashboard-agreements/AgreementCard";

// Mock Data
const MOCK_AGREEMENTS: AgreementData[] = [
  {
    id: "1",
    title: "Sponsorship Contract",
    project: "AfroVibe Festival Launch",
    createdDate: "April 23 2026",
    lastUpdated: "May 4 2026",
    collaboratorsCount: 5,
    collaborators: [{ id: "c1", name: "Alice" }, { id: "c2", name: "Chase" }, { id: "c3", name: "Nefo" }, { id: "c4", name: "Genshin" }, { id: "c5", name: "Natsu" }],
    status: "pending",
    completedSignatures: 3,
    totalSignatures: 5,
  },
  {
    id: "2",
    title: "Content Creator Agreement",
    project: "Studio Pro Campaign",
    createdDate: "28 August 2026",
    lastUpdated: "5 minutes ago",
    collaboratorsCount: 2,
    collaborators: [{ id: "c6", name: "Bob" }, { id: "c7", name: "Charlie" }],
    status: "signed",
    completedSignatures: 2,
    totalSignatures: 2,
  },
  {
    id: "3",
    title: "Collaboration Terms",
    project: "Music Production Series",
    createdDate: "25 July 2026",
    lastUpdated: "8 hours ago",
    collaboratorsCount: 5,
    collaborators: [{ id: "c8", name: "David" }, { id: "c9", name: "Sidney" }, { id: "c9", name: "Cyan" }, { id: "c11", name: "Omotola" }, { id: "c12", name: "Genevieve" }],
    status: "pending",
    completedSignatures: 3,
    totalSignatures: 5,
  },
  {
    id: "4",
    title: "License Agreement",
    project: "Beat Library Access",
    createdDate: "15 February 2026",
    lastUpdated: "30 February 2026",
    collaboratorsCount: 3,
    collaborators: [{ id: "c13", name: "Eve" }],
    status: "expired",
    completedSignatures: 0,
    totalSignatures: 3,
  },
];

// Tabs
const TAB_OPTIONS = [
  "Overview", 
  "Pending Signatures(2)", 
  "Signed Agreements", 
];

export default function AgreementsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");

  const handleTriggerSign = (agreement: AgreementData) => {
    console.log("Trigger signing flow for:", agreement.title);
  };

  const handleDownload = (agreement: AgreementData) => {
      console.log("Downloading signed agreement for:", agreement.title);
    };
  
    const handleView = (agreement: AgreementData) => {
      console.log("Opening read-only view for:", agreement.title);
    };

  // Map tab strings to filter statuses
  const getFilterStatus = (tab: string) => {
    if (tab.includes("Pending")) return "pending";
    if (tab.includes("Signed")) return "signed";
    return "all";
  };

  const activeStatus = getFilterStatus(activeTab);

  const filteredAgreements = MOCK_AGREEMENTS.filter((agreement) => {
    const matchesSearch = agreement.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeStatus === "all" || agreement.status === activeStatus;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="relative w-full min-h-screen lg:p-3 overflow-hidden">

      <div className="flex flex-col gap-[50px] max-w-300 mx-auto">
        
        {/* Navigation Tabs */}
        <div className="flex justify-start px-3">
          <Tabs 
            tabs={TAB_OPTIONS} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-275.25">
          <FiSearch size={23} className="absolute left-8.5 top-1/2 -translate-y-1/2 text-white/30 z-10" />
          <Input
            type="text"
            variant="glass"
            placeholder="Search agreements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-18.5 h-12.25 bg-black/10 rounded-full font-raleway font-normal text-[20px] leading-6 border-none"
          />
        </div>

        {/* Agreements List */}
        <div className="flex flex-col gap-6">
          {filteredAgreements.length > 0 ? (
            filteredAgreements.map((agreement) => (
              <AgreementCard
                key={agreement.id}
                agreement={agreement}
                onTriggerSign={handleTriggerSign}
                onDownload={handleDownload}
                onView={handleView}
              />
            ))
          ) : (
            // Empty State
            <div className="max-w-275">
              <EmptyState 
                icon={<FiFileText size={32} />}
                title="No Agreements Found"
                description="Try adjusting your search or filter settings."
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}