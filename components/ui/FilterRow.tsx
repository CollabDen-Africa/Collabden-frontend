import React from "react";

export interface FilterRowProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: string[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export const FilterRow: React.FC<FilterRowProps> = ({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  activeFilter = "All",
  onFilterChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="relative flex-1 max-w-sm">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full bg-[#121415] border border-white/5 rounded-full py-2 px-4 pl-10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
        />
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange?.(filter)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-[#72c043] text-black"
                  : "bg-[#121415] border border-white/5 text-white/60 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
