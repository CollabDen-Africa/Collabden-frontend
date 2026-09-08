"use client";

import React, { useState } from "react";
import { FiUsers, FiSearch, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar"; 
import Select from "@/components/ui/Select";
import { Project } from "@/types/api.types";
import { useProjects } from "@/hooks/projects/useProjects";
import { useConnections } from "@/hooks/connections/useConnections";

interface MembersSettingsTabProps {
  project?: Project;
}

export default function MembersSettingsTab({ project }: MembersSettingsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConnectionId, setSelectedConnectionId] = useState("");

  const { useInviteCollaborator, useRemoveCollaborator } = useProjects();
  const inviteMutation = useInviteCollaborator(project?.id || "");
  const removeMutation = useRemoveCollaborator(project?.id || "");

  const { useUserConnections } = useConnections();
  const { data: connections = [] } = useUserConnections();

  // Active collaborators inside this project
  const activeCollaborators = project?.collaborators || [];

  // Filter connections to only show those NOT already in the project
  const inviteCandidates = connections.filter(
    (conn) => !activeCollaborators.some((collab) => collab.userId === conn.id && collab.isActive)
  );

  // Map collaborators to displayable member object
  const members = activeCollaborators.map((c) => ({
    id: c.userId,
    name: c.user?.email ? c.user.email.split("@")[0] : "Collaborator",
    email: c.user?.email || "No email",
    role: c.role === "OWNER" ? "Owner" : "Collaborator",
    isOwner: c.role === "OWNER",
    access: c.role === "OWNER" ? "Owner" : "Editor",
  }));

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = async () => {
    if (!selectedConnectionId || !project?.id) return;
    try {
      await inviteMutation.mutateAsync({ collaboratorId: selectedConnectionId });
      setSelectedConnectionId("");
    } catch (err) {
      console.error("Failed to invite collaborator:", err);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!project?.id) return;
    if (confirm("Are you sure you want to remove this collaborator from the project?")) {
      try {
        await removeMutation.mutateAsync(userId);
      } catch (err) {
        console.error("Failed to remove collaborator:", err);
      }
    }
  };

  if (!project) {
    return (
      <div className="w-full max-w-[931px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] lg:rounded-[50px] p-[32px] lg:p-[48px] shadow-2xl flex items-center justify-center">
        <p className="text-white/60">No active project selected.</p>
      </div>
    );
  }

  // Options for custom select
  const connectionOptions = inviteCandidates.map((conn) => conn.email);

  return (
    <div className="w-full max-w-[931px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] lg:rounded-[50px] p-[32px] lg:p-[48px] shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500">
      
      <div className="flex flex-col gap-[32px] w-full max-w-[860px]">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center p-[20px] lg:p-[24px] gap-[16px] bg-black/10 rounded-[30px] border border-white/5 shadow-inner">
          <div className="w-[54px] h-[54px] bg-white/20 rounded-[15px] flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
            <FiUsers className="text-white" size={24} />
          </div>
          <div className="flex flex-col justify-center gap-[4px]">
            <h2 className="font-raleway font-semibold text-[22px] lg:text-[25px] leading-[29px] text-white">
              Members & Roles
            </h2>
            <p className="font-raleway font-medium text-[15px] lg:text-[18px] leading-[21px] text-white/60">
              Manage who has access to this project and what they can do.
            </p>
          </div>
        </div>

        {/* Invite Collaborator Section */}
        <div className="flex flex-col gap-[16px] w-full bg-black/15 border border-white/5 p-6 rounded-[24px]">
          <h3 className="font-raleway font-bold text-[16px] text-white">Invite Collaborator</h3>
          <p className="font-raleway font-normal text-[13px] text-white/60 -mt-2">
            Only users in your accepted connections can be invited.
          </p>
          <div className="flex flex-col sm:flex-row gap-[16px] items-stretch sm:items-center mt-2">
            <div className="flex-1 relative min-h-[44px]">
              <Select
                options={connectionOptions}
                value={
                  connections.find((c) => c.id === selectedConnectionId)?.email || ""
                }
                onChange={(val) => {
                  const matched = connections.find((c) => c.email === val);
                  if (matched) setSelectedConnectionId(matched.id);
                }}
                placeholder="Choose a connected colleague..."
                variant="glass"
              />
            </div>
            <button
              onClick={handleInvite}
              disabled={!selectedConnectionId || inviteMutation.isPending}
              className="bg-primary-green hover:bg-accent-green-success disabled:opacity-50 disabled:cursor-not-allowed text-white font-sans font-semibold text-[14px] px-[24px] py-[12px] rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(115,191,68,0.3)] flex items-center justify-center gap-2"
            >
              <FiPlusCircle size={16} />
              {inviteMutation.isPending ? "Inviting..." : "Invite"}
            </button>
          </div>
        </div>

        {/* Search Bar Wrapper */}
        <div className="flex flex-col w-full gap-[16px]">
          <div className="w-full h-[50px] bg-white/10 border border-transparent focus-within:border-primary-green focus-within:bg-white/15 rounded-full flex items-center px-[20px] transition-all duration-300 shadow-sm group">
            <FiSearch className="text-white/50 group-focus-within:text-primary-green shrink-0 mr-[12px] transition-colors" size={18} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none font-raleway font-medium text-[16px] text-white placeholder:text-white/50"
              placeholder="Search collaborators"
            />
          </div>
        </div>

        {/* Members List */}
        <div className="flex flex-col w-full gap-[12px] mt-[10px]">
          
          {filteredMembers.length === 0 ? (
            <div className="w-full py-8 text-center text-white/50 font-raleway font-medium">
              No collaborators found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between w-full p-[16px] lg:px-[24px] lg:py-[20px] bg-black/10 hover:bg-black/20 border border-white/5 hover:border-white/10 rounded-[24px] transition-all duration-300"
              >
                
                {/* Left Side: Avatar & Info */}
                <div className="flex items-center gap-[16px]">
                  <div className="w-[48px] h-[48px] rounded-full overflow-hidden shrink-0 bg-white/10 border border-white/20">
                     <Avatar name={member.name} /> 
                  </div>
                  <div className="flex flex-col gap-[2px]">
                    <div className="flex items-center gap-[8px]">
                      <span className="font-raleway font-bold text-[16px] lg:text-[18px] text-white">
                        {member.name}
                      </span>
                      {member.isOwner && (
                        <span className="bg-primary-green/20 border border-primary-green/30 text-primary-green text-[10px] font-bold uppercase tracking-wider px-[8px] py-[2px] rounded-full">
                          Owner
                        </span>
                      )}
                    </div>
                    <span className="font-raleway font-medium text-[13px] lg:text-[14px] text-white/60">
                      {member.role} • {member.email}
                    </span>
                  </div>
                </div>

                {/* Right Side: Access Level & Options */}
                <div className="flex items-center gap-[16px] lg:gap-[24px]">
                  
                  {/* Access Dropdown Indicator */}
                  <div className="hidden sm:block">
                    <Select 
                      options={["Viewer", "Editor", "Admin"]}
                      value={member.access}
                      onChange={() => {}} // Local access visual only
                      variant="glass"
                      disabled={true} // Only OWNER vs COLLABORATOR supported in DB
                    />
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => handleRemove(member.id)}
                    disabled={member.isOwner || removeMutation.isPending}
                    className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-red-500/20 text-white/45 hover:text-red-500 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Remove collaborator"
                  >
                    <FiTrash2 size={18} />
                  </button>

                </div>
              </div>
            ))
          )}
          
        </div>

      </div>
    </div>
  );
}