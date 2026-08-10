"use client";

import React, { useState, useEffect, useRef } from "react";
import DirectoryFilters from "./DirectoryFilters";
import CollaboratorCard from "./CollaboratorCard";
import { FiSearch, FiChevronDown, FiFilter } from "react-icons/fi";

// --- Mock Data for Filtering ---
const MOCK_DATA = [
  {
    name: "Yemi Sounds",
    role: "Music Producer · Lagos, NG · 8y exp",
    categoryRoles: ["Producers"],
    bio: "Award-winning producer with 8 years crafting chart-topping hits across Afrobeats, R&B, and Hip-Hop. Known for rhythmic versatility.",
    genres: ["Afrobeats", "R&B", "Hip-Hop"],
    projects: 25,
    rating: 4.5,
    endorsements: 88,
    image: "/mock-profiles/David.png",
    availability: ["Open to collaborate"],
    verified: true
  },
  {
    name: "Tim Martin",
    role: "Vocalist & Topliner · London, UK · 6y exp",
    categoryRoles: ["Vocalists", "Songwriters"],
    bio: "Soulful vocal delivery and catchy hook arrangements designed for commercial radio success.",
    genres: ["R&B Soul", "Pop", "Afrobeats"],
    projects: 19,
    rating: 4.9,
    endorsements: 64,
    image: "/mock-profiles/Tayo.png",
    availability: ["Open to collaborate", "Recently active"],
    verified: false
  },
  {
    name: "Andre Collins",
    role: "Mixing Engineer · Atlanta, US · 10y exp",
    categoryRoles: ["Engineers", "Mix & Master"],
    bio: "Precision mixing and spatial audio specialist ensuring your mix translates perfectly on all sound systems.",
    genres: ["Hip-Hop", "Trap", "Pop"],
    projects: 42,
    rating: 4.8,
    endorsements: 112,
    image: "/mock-profiles/small2.png",
    availability: ["Open to collaborate"],
    verified: true
  }
];

const ROLE_OPTIONS = ["All Genres", "Producers", "Engineers", "Vocalists", "Instrumentalists", "Songwriters", "Mix & Master"];
const SORT_OPTIONS = ["Most relevant", "Highest Rated", "Most Projects", "Most Endorsed"];

interface CollaboratorSearchProps {
  initialSearchQuery?: string;
  initialRole?: string;
}

export default function CollaboratorSearch({ initialSearchQuery = "", initialRole = "All Genres" }: CollaboratorSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  
  // Sidebar Filter State
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    availability: ["Open to collaborate"],
    roles: [initialRole],
    rating: ["All Rating"],
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Most relevant");

  // Refs for closing dropdowns on outside click
  const roleRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  useEffect(() => {
      setActiveFilters(prev => ({
        ...prev,
        roles: [initialRole]
      }));
    }, [initialRole]);

  // Click outside listener for custom dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setIsRoleDropdownOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setIsSortDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleFilter = (categoryId: string, option: string) => {
    setActiveFilters((prev) => {
      const currentSelections = prev[categoryId] || [];
      if (option.startsWith("All ")) {
        return { ...prev, [categoryId]: [option] };
      }
      let updatedSelections = currentSelections.filter(item => !item.startsWith("All "));
      if (updatedSelections.includes(option)) {
        updatedSelections = updatedSelections.filter(item => item !== option);
      } else {
        updatedSelections = [...updatedSelections, option];
      }
      if (updatedSelections.length === 0) {
        if (categoryId === "roles") updatedSelections = ["All Genres"];
        if (categoryId === "rating") updatedSelections = ["All Rating"];
      }
      return { ...prev, [categoryId]: updatedSelections };
    });
  };

  // Helper to sync the Top Role Dropdown with the Sidebar Filters
  const handleTopRoleSelect = (role: string) => {
    setActiveFilters(prev => ({ ...prev, roles: [role] }));
    setIsRoleDropdownOpen(false);
  };

  // Filters the Data
  const filteredData = MOCK_DATA.filter((creator) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      !query ||
      creator.name.toLowerCase().includes(query) ||
      creator.role.toLowerCase().includes(query) ||
      creator.genres.some((g) => g.toLowerCase().includes(query));
    if (!matchesSearch) return false;

    if (activeFilters.availability.length > 0) {
      const passesAvailability = activeFilters.availability.every(req => {
        if (req === "Verified only") return creator.verified;
        return creator.availability.includes(req);
      });
      if (!passesAvailability) return false;
    }

    if (activeFilters.roles.length > 0 && !activeFilters.roles.includes("All Genres")) {
      const matchesRole = activeFilters.roles.some(role => creator.categoryRoles.includes(role));
      if (!matchesRole) return false;
    }

    if (activeFilters.rating.length > 0 && !activeFilters.rating.includes("All Rating")) {
      const numericRatings = activeFilters.rating.map(r => parseFloat(r));
      const minRequiredRating = Math.min(...numericRatings);
      if (creator.rating < minRequiredRating) return false;
    }
    return true;
  });

  // Sorts the Data based on Dropdown Selection
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === "Highest Rated") return b.rating - a.rating;
    if (sortBy === "Most Projects") return b.projects - a.projects;
    if (sortBy === "Most Endorsed") return b.endorsements - a.endorsements;
    return 0; // Default "Most relevant" relies on standard array order
  });

  // Duplicates to fill grid
  const displayData = [...sortedData, ...sortedData, ...sortedData, ...sortedData];

  // Determines current active role label for top button
  const currentRoleLabel = activeFilters.roles.length === 1 && !activeFilters.roles.includes("All Genres") 
    ? activeFilters.roles[0] 
    : "All roles";

  return (
    <div className="relative w-full h-full overflow-hidden flex justify-center transition-all duration-300">
      <main className="relative z-10 w-full flex flex-col items-center">
        
        {/* Top Search & Filter Actions Row */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-5 mb-8">
          
          <div className="flex w-full max-w-281 gap-3">
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden h-10 px-4 bg-white/10 rounded-full flex items-center justify-center border border-white/5 shrink-0 hover:bg-white/20 transition-colors"
            >
              <FiFilter className="text-white/80" size={16} />
            </button>

            {/* Search Input */}
            <div className="flex-1 h-10 w-full bg-white/10 rounded-[50px] flex items-center px-0.5 sm:px-2.5 gap-2.5 backdrop-blur-md border border-white/5 focus-within:border-primary-green/50 transition-colors">
              <FiSearch className="text-white/80 shrink-0 ml-2" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, skill, role, genre or keyword..."
                className="flex-1 bg-transparent border-none outline-none font-sans text-[14px] leading-4 text-white placeholder:text-text-muted"
              />
            </div>
          </div>

          {/* Role Dropdown Button */}
          <div className="relative w-full lg:w-auto shrink-0" ref={roleRef}>
            <button 
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="w-full lg:w-49.25 h-9.5 bg-primary-green transition-colors rounded-[20px] flex items-center justify-between px-4 shadow-sm"
            >
              <div className="flex items-center gap-2 justify-center mx-auto">
                <FiFilter size={14} className="text-whit" />
                <span className="font-sans font-medium text-[12px] leading-3.5 text-white truncate max-w-30">
                  {currentRoleLabel}
                </span>
              </div>
              <FiChevronDown className="text-white" />
            </button>

            {/* Role Dropdown Menu */}
            {isRoleDropdownOpen && (
              <div className="absolute top-11.5 right-0 w-full lg:w-49.25 bg-black/25 backdrop-blur-lg border border-border-muted rounded-2xl overflow-hidden shadow-2xl z-50">
                {ROLE_OPTIONS.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleTopRoleSelect(role)}
                    className="w-full text-left px-4 py-3 font-sans text-[13px] text-white hover:bg-white/10 transition-colors"
                  >
                    {role === "All Genres" ? "All roles" : role}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Layout Area */}
        <div className="w-full flex flex-col lg:flex-row gap-2.5">
          
          {/* Left Sidebar (Filters) */}
          <aside className={`w-full lg:w-53.5 shrink-0 ${isMobileFilterOpen ? "block mb-6" : "hidden lg:block"}`}>
            <div className="sticky top-29">
              <DirectoryFilters 
                activeFilters={activeFilters} 
                onToggleFilter={handleToggleFilter} 
              />
            </div>
          </aside>

          {/* Right Area (Grid) */}
          <div className="flex-1 w-full max-w-282 flex flex-col gap-8">
            
            {/* Results Header */}
            <div className="flex flex-wrap items-center justify-between w-full max-w-280 gap-4">
              <h1 className="font-sans font-medium text-[24px] leading-7 text-white">
                {displayData.length} Collaborators
              </h1>

              {/* Sort Dropdown Button */}
              <div className="relative shrink-0" ref={sortRef}>
                <button 
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="h-8 px-5 bg-black/15 rounded-full flex items-center justify-center gap-2 hover:bg-white/20 transition-colors border border-white/5"
                >
                  <span className="font-sans font-medium text-[14px] leading-4 text-white/80">
                    {sortBy}
                  </span>
                  <FiChevronDown className="text-white/60" />
                </button>

                {/* Sort Dropdown Menu */}
                {isSortDropdownOpen && (
                  <div className="absolute top-10 right-0 w-40 bg-black/25 backdrop-blur-lg border border-border-muted rounded-xl overflow-hidden shadow-2xl z-50">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setIsSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 font-sans text-[13px] hover:bg-white/10 transition-colors ${
                          sortBy === option ? "text-primary-green font-semibold" : "text-white"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cards Grid */}
            {displayData.length === 0 ? (
              <div className="w-full py-20 text-center bg-black/30 backdrop-blur-md rounded-[30px] border border-white/5">
                <p className="text-white/60">No collaborators found matching your exact filters.</p>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilters({ availability: [], roles: ["All Genres"], rating: ["All Rating"] });
                  }} 
                  className="mt-4 text-primary-green hover:underline text-sm font-medium"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-6 w-full">
                {displayData.map((creator, i) => (
                  <CollaboratorCard key={`${creator.name}-${i}`} {...creator} />
                ))}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}