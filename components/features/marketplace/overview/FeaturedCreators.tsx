"use client";

import React from "react";
// Ensure this path correctly points to your CollaboratorCard component
import CollaboratorCard from "@/components/features/marketplace/collab-search/CollaboratorCard"; 
import { useCollaborator } from "@/hooks/collaborator/useCollaborator";

interface FeaturedCreatorsProps {
  onSearch: () => void;
}

export default function FeaturedCreators({ onSearch }: FeaturedCreatorsProps) {
  const { useCollaborators } = useCollaborator();
  const { data: creators = [] } = useCollaborators({ openToCollaborate: "true" });
  return (
    <section className="flex flex-col w-full gap-8 my-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full gap-4">
        <h2 className="font-sans font-semibold text-[28px] lg:text-[40px] text-white max-w-104.75 leading-11.75">
          Rated by the records they
         <span className="italic text-primary-green">
          shipped
         </span>
        </h2>
        <button 
          onClick={onSearch}
          className="px-5 py-1.5 bg-white/5 border border-white/30 rounded-full text-white font-sans text-[15px] hover:bg-white/10 transition-colors shrink-0"
        >
          View all creators
        </button>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 w-full">
        {creators.slice(0, 3).map((creator) => (
          <CollaboratorCard key={creator.id} userId={creator.id} name={creator.displayName || creator.legalName || creator.email.split("@")[0]} role={creator.experience || "Collaborator"} bio={creator.bio || "No bio provided."} genres={creator.genres || []} image={creator.avatarUrl || undefined} openToCollaborate={creator.openToCollaborate} isVerified={Boolean(creator.identityVerified || creator.isVerified)} />
        ))}
      </div>
    </section>
  );
}
