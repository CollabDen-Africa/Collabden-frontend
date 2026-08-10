"use client";

import React from "react";

interface DirectoryFiltersProps {
  activeFilters: Record<string, string[]>;
  onToggleFilter: (categoryId: string, option: string) => void;
}

export default function DirectoryFilters({ activeFilters, onToggleFilter }: DirectoryFiltersProps) {
  const FILTER_SECTIONS = [
    {
      id: "availability",
      title: "Availability",
      options: ["Open to collaborate", "Verified only", "Recently active"],
    },
    {
      id: "roles",
      title: null, 
      options: ["All Genres", "Producers", "Engineers", "Vocalists", "Instrumentalists", "Songwriters", "Mix & Master"],
    },
    {
      id: "rating",
      title: null,
      options: ["All Rating", "3.0+", "3.5+", "4.0+", "4.5+"],
    }
  ];

  return (
    <div className="w-full flex flex-col gap-5">
      {FILTER_SECTIONS.map((section) => (
        <div 
          key={section.id} 
          className="flex flex-col bg-black/20 rounded-4 py-2.5 w-full lg:w-53.5 shadow-sm"
        >
          {section.title && (
            <div className="flex items-center px-4 py-2">
              <span className="font-sans font-medium text-[13px] leading-3.75 text-text-muted">
                {section.title}
              </span>
            </div>
          )}
          
          {section.options.map((option, idx) => {
            // Check if this specific option is currently selected in the state
            const isActive = activeFilters[section.id]?.includes(option);

            return (
              <label 
                key={idx} 
                onClick={() => onToggleFilter(section.id, option)}
                className="flex items-center px-4 py-2 gap-2.5 cursor-pointer hover:bg-white/5 transition-colors group"
              >
                {/* Checkbox indicator */}
                <div 
                  className={`w-2 h-2 rounded-[1px] transition-colors shrink-0 ${
                    isActive ? "bg-primary-green" : "bg-white group-hover:bg-primary-green/50"
                  }`} 
                />
                
                <span className={`font-sans font-medium text-[13px] leading-5 select-none transition-colors ${
                  isActive ? "text-primary-green" : "text-white"
                }`}>
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      ))}
    </div>
  );
}