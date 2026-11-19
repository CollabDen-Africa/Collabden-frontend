"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FiSearch, FiFolder, FiUsers } from "react-icons/fi";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="flex flex-col gap-8 w-full max-w-232.75 mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-raleway font-bold text-[24px] lg:text-[28px] text-white">
          Search Results
        </h1>
        <p className="font-sans text-[15px] text-white/60">
          Showing results for <span className="text-white font-medium">&quot;{query}&quot;</span>
        </p>
      </div>

      {/* Tabs (Visual Placeholder) */}
      <div className="flex items-center gap-6 border-b border-white/10 pb-4">
        <button className="flex items-center gap-2 text-primary-green font-sans font-semibold text-[14px] border-b-2 border-primary-green pb-4 -mb-4.5">
          <FiFolder size={16} />
          Projects
        </button>
        <button className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors font-sans font-semibold text-[14px] pb-4 -mb-4.5">
          <FiUsers size={16} />
          Collaborators
        </button>
      </div>

      {/* Empty State / API Placeholder */}
      <div className="w-full py-24 flex flex-col items-center justify-center bg-white/2 border border-white/5 rounded-[30px] mt-4">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-5">
          <FiSearch size={28} className="text-white/30" />
        </div>
        <h3 className="font-raleway font-bold text-[18px] text-white mb-2">
          Searching for &quot;{query}&quot;
        </h3>
        <p className="font-sans text-[14px] text-white/50 text-center max-w-md">
          This page is almost ready - hook up the global search API here to fetch and display matching projects, users, and agreements.
        </p>
      </div>

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense 
      fallback={
        <div className="w-full py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-primary-green/30 border-t-primary-green rounded-full animate-spin" />
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}