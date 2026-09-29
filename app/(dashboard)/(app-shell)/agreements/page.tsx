"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@/components/ui/Tabs";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import { FiSearch, FiFileText } from "react-icons/fi";
import AgreementCard from "@/components/features/dashboard-agreements/AgreementCard";
import { LegalAgreement } from "@/types/api.types";
import { useUserAgreements } from "@/hooks/projects/useAgreements";


export default function AgreementsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: agreements = [], isLoading } = useUserAgreements();

  const handleTriggerSign = (agreement: LegalAgreement) => {
    // Redirect to the specific project workspace agreements tab
    router.push(`/projects/${agreement.projectId}/agreements`);
      };

  const handleDownload = (agreement: LegalAgreement) => {
    if (agreement.fileUrl) {
        window.open(agreement.fileUrl, '_blank');
      }
    };
  
  const handleView = (agreement: LegalAgreement) => {
      // Either open the document directly or route to the workspace view
      if (agreement.fileUrl) {
        window.open(agreement.fileUrl, '_blank');
      } else {
        router.push(`/projects/${agreement.projectId}/agreements`);
      }
    };

  // Map tab strings to filter statuses
  const getFilterStatus = (tab: string) => {
    if (tab.includes("Pending")) return "PENDING_SIGNATURE";
    if (tab.includes("Signed")) return "SIGNED";
    return "ALL";
  };

  const activeStatus = getFilterStatus(activeTab);

  const filteredAgreements = agreements.filter((agreement: LegalAgreement) => {
    const matchesSearch = (agreement.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeStatus === "ALL" || agreement.status === activeStatus;
    return matchesSearch && matchesTab;
  });

  const pendingCount = agreements.filter((a: LegalAgreement) => a.status === "PENDING_SIGNATURE").length;
    
    const TAB_OPTIONS = [
      "Overview", 
      `Pending Signatures (${pendingCount})`, 
      "Signed Agreements", 
    ];
  
    if (isLoading) {
      return (
        <div className="flex w-full min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green"></div>
        </div>
      );
    }

  return (
    <div className="relative w-full min-h-screen lg:p-3 overflow-hidden">

      <div className="flex flex-col gap-12.5 max-w-300 mx-auto">
        
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
            filteredAgreements.map((agreement: LegalAgreement) => (
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