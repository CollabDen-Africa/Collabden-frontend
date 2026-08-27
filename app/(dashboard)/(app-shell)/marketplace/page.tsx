"use client";

import React, { useState } from "react";
import MarketplaceHero from "@/components/features/marketplace/overview/MarketplaceHero";
import GenreTicker from "@/components/features/marketplace/overview/GenreTicker";
import CategoryBrowser from "@/components/features/marketplace/overview/CategoryBrowser";
import FeaturedCreators from "@/components/features/marketplace/overview/FeaturedCreators";
import MarketplaceProjects from "@/components/features/marketplace/project-marketplace/MarketplaceProjects";
import CollaboratorSearch from "@/components/features/marketplace/collab-search/CollaboratorSearch";

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<"collaborators" | "projects">("collaborators");

  // State to toggle between the overview and the search component
    const [collaboratorView, setCollaboratorView] = useState<"overview" | "search">("overview");
    
    // Filter states to pass into CollaboratorSearch
      const [searchQuery, setSearchQuery] = useState("");
      const [activeRole, setActiveRole] = useState("All Genres");
    
    // Fired when searching via MarketplaceHero text input
     const handleOpenSearch = (query: string = "") => {
       setSearchQuery(query);
       setActiveRole("All Genres");
      setCollaboratorView("search");
     };

     // Fired when clicking a specific craft in CategoryBrowser
       const handleCategoryClick = (categoryTitle: string) => {
         setSearchQuery(""); // Clear text search to focus strictly on the category
         setActiveRole(categoryTitle); 
         setCollaboratorView("search");
       };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center font-sans">
      {/* Background Video & Glow Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40">
          <source src="/hero_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Main Content Skeleton */}
      <div className="relative z-10 w-full max-w-300 px-5 lg:px-0 mx-auto flex flex-col md:-mt-22">
        {/* Toggle Navigation Tabs */}
        <div className="flex items-center gap-2.5 bg-white/15 p-[5px_10px] rounded-full w-fit mb-10 self-center">
          <button
            onClick={() => {
                          setActiveTab("collaborators");
                          setCollaboratorView("overview");
                        }}
            className={`px-5 py-1.25 font-sans text-[13px] rounded-full transition-all ${
              activeTab === "collaborators"
                ? "bg-primary-green text-white font-semibold"
                : "text-white/80 hover:text-white"
            }`}
          >
            Collaborators
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-5 py-1.25 font-sans text-[13px] rounded-full transition-all ${
              activeTab === "projects"
                ? "bg-primary-green text-white font-semibold"
                : "text-white/80 hover:text-white"
            }`}
          >
            Projects
          </button>
        </div>

        {/* Tab Content Rendering */}
        {activeTab === "collaborators" ? (
                  collaboratorView === "overview" ? (
                    <div className="flex flex-col">
                         <MarketplaceHero onSearch={handleOpenSearch} />
                      <GenreTicker />
                      <CategoryBrowser onCategoryClick={handleCategoryClick} />
                      <FeaturedCreators onSearch={() => handleOpenSearch()} />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
                      {/* Back Button to return to the overview */}
                      <button 
                        onClick={() => setCollaboratorView("overview")}
                        className="w-fit text-sm font-medium text-text-muted hover:text-white transition-colors flex items-center gap-2"
                      >
                        ← Back to Overview
                      </button>
                      
                      {/* Render the actual component instead of routing */}
                <CollaboratorSearch initialSearchQuery={searchQuery}
                initialRole={activeRole}
                />
                    </div>
                  )
                ) : (
                  <div className="flex flex-col gap-5">
                    <MarketplaceProjects />
                  </div>
                )}
      </div>
    </div>
  );
}