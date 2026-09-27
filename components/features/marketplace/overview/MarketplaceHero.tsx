"use client";

import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import { useCollaborator } from "@/hooks/collaborator/useCollaborator";

const TRENDING_TAGS = ["Afrobeats", "Mix & Master", "Topline writer", "Amapiano drums"];


interface MarketplaceHeroProps {
  onSearch: (query: string) => void;
}

export default function MarketplaceHero({ onSearch }: MarketplaceHeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { useCollaborators } = useCollaborator();
  const { data: collaborators = [] } = useCollaborators({
    openToCollaborate: "true",
  });
  // Handle routing with the search query
  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleTrendingClick = (tag: string) => {
    setSearchQuery(tag);
    onSearch(tag);
  };

  return (
    <section className="relative w-full flex flex-col xl:flex-row items-center justify-between gap-10 pt-5">
      {/* Left Column: Heading, Search & Trending */}
      <div className="flex flex-col items-start max-w-187 w-full gap-8">
        {/* Top Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-black/10 border border-white/20 rounded-full backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-green animate-pulse" />
          <span className="font-sans font-medium text-[13px] text-white">
            CollabDen Marketplace
          </span>
          <span className="w-[3.5px] h-[3.5px] rounded-full bg-white/60" />
          <span className="font-sans font-medium text-[13px] text-white">
            {collaborators.length} collaborators
          </span>
        </div>

        {/* Main Headline */}
        <div className="flex flex-col gap-4 max-w-137.25">
          <h1 className="font-sans font-extrabold text-[36px] md:text-[48px] leading-[1.16] text-white tracking-tight">
            Find your next
            <span className="italic text-primary-green">creative</span>
            collaborator.
          </h1>
          <p className="font-sans font-normal text-[16px] leading-[1.4] text-white">
            Discover verified producers, vocalists, songwriters, and engineers
            ready to bring your vision to life. Escrow-protected payments.
            Community-driven.
          </p>
        </div>

        {/* Search Bar Group */}
        <div className="flex flex-col gap-4 w-full max-w-187">
          <div className="relative w-full max-w-174 h-12.75 bg-white/5 border border-white/30 rounded-full flex items-center px-5 backdrop-blur-md">
            <FiSearch className="text-white/80 shrink-0" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by collaborator name..."
              className="flex-1 ml-3 bg-transparent border-none outline-none font-sans text-[16px] text-white placeholder:text-white/80"
            />
            <button
              onClick={handleSearch}
              className="absolute right-1.5 h-10 px-5.5 bg-primary-green hover:bg-accent-green-success transition-all rounded-full flex items-center justify-center text-white font-sans font-medium text-[16px] shadow-md"
            >
              Find collaborators
            </button>
          </div>

          {/* CTA to Directory */}
          <button
            onClick={() => onSearch("")}
            className="text-left font-sans font-medium text-[13px] text-primary-green hover:text-white! transition-colors flex items-center gap-1 w-fit -mt-1"
          >
            Browse all verified collaborators →
          </button>

          {/* Trending Tags Row */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-sans font-semibold text-[12px] tracking-wider text-white">
              Trending:
            </span>
            {TRENDING_TAGS.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => handleTrendingClick(tag)}
                className="px-2.5 py-1.25 bg-white/5 border border-white/30 rounded-full font-sans font-semibold text-[10px] text-white hover:bg-white/15 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Verified Creators Stack Footer */}
        <div className="flex items-center gap-4 mt-2.5">
          <div className="flex items-center -space-x-3">
            {collaborators.slice(0, 4).map((collab) => (
              <div
                key={collab.id}
                className="relative w-10.5 h-10.5 rounded-full border-2 border-primary-green overflow-hidden"
              >
                <Avatar
                  name={collab.displayName || collab.legalName || collab.email}
                  src={collab.avatarUrl || undefined}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-semibold text-[18px] leading-tight text-white">
              {collaborators.length} available creators
            </span>
            <span className="font-sans font-semibold text-[14px] text-white/60">
              Ready to collab
            </span>
          </div>
        </div>
      </div>

      {/* Live collaborator previews */}
      <div className="hidden xl:flex flex-col gap-10 relative max-w-90.75 w-full h-58.25 pt-4">
        {collaborators.slice(0, 3).map((collaborator, index) => (
          <div
            key={collaborator.id}
            className={`px-2 py-2 bg-white/15 backdrop-blur-md rounded-full flex items-center gap-2 w-64.75 shadow-xl ${index % 2 === 0 ? "translate-x-25.5" : ""}`}
          >
            <Avatar
              name={
                collaborator.displayName ||
                collaborator.legalName ||
                collaborator.email
              }
              src={collaborator.avatarUrl || undefined}
              className="w-9.75 h-9.75 border border-primary-green rounded-full"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-sans font-extrabold text-[16px] text-white truncate">
                  {collaborator.displayName ||
                    collaborator.legalName ||
                    collaborator.email.split("@")[0]}
                </span>
              </div>
              <span className="font-sans text-[12px] text-white">
                {collaborator.experience || "Collaborator"}
              </span>
            </div>
            <span className="px-[8px] py-[4px] bg-primary-green/30 text-primary-green text-[10px] font-semibold rounded-full shrink-0">
              {collaborator.genres?.[0] || "Open"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
