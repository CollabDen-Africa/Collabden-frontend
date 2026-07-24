"use client";

import React, { useState } from "react";
import { useUser } from "@/hooks/admin/useUser";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Tabs } from "@/components/ui/Tabs";
import { UserHeader } from "./UserHeader";
import { UserOverview } from "./UserOverview";
import { UserActivity } from "./UserActivity";
import { UserReports } from "./UserReports";
import { UserNotesAudit } from "./UserNotesAudit";

interface UserDetailsProps {
  id: string;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ id }) => {
  const { data: user, isLoading, isError } = useUser(id);
  const [activeTab, setActiveTab] = useState("Overview");

  if (isLoading) return <div className="p-8 text-white/40 text-center">Loading user details...</div>;
  if (isError || !user) return <div className="p-8 text-red-500 text-center">Error loading user</div>;

  const name = user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown';
  const verifiedOn = user.identityVerified ? "Feb 3, 2024" : "Not Verified"; // mock for now

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-white">
  
      <Breadcrumbs 
        items={[
          { label: "Admin Portal" },
          { label: "Users", href: "/admin/users" },
          { label: name }
        ]} 
      />

      <div className="w-full bg-[#121415] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
        {/* Header Section */}
        <UserHeader user={user} />

        {/* Tabs */}
        <Tabs 
          tabs={['Overview', 'Activity', 'Reports', 'Notes & Audit']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Tab Content */}
        {activeTab === 'Overview' && (
          <UserOverview user={user} name={name} verifiedOn={verifiedOn} />
        )}

        {/* Activity Tab */}
        {activeTab === 'Activity' && (
          <UserActivity userId={id} />
        )}

        {/* Reports Tab */}
        {activeTab === 'Reports' && (
          <UserReports userId={id} />
        )}

        {/* Notes & Audit Tab */}
        {activeTab === 'Notes & Audit' && (
          <UserNotesAudit userId={id} />
        )}

        {/* Other Tabs Placeholder */}
        {activeTab !== 'Overview' && activeTab !== 'Activity' && activeTab !== 'Reports' && activeTab !== 'Notes & Audit' && (
          <div className="p-8 text-white/40 text-center bg-[#0a0a0c]">
            Content for {activeTab} will be displayed here.
          </div>
        )}
      </div>
    </div>
  );
};
