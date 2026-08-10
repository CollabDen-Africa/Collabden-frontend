"use client";

import React from "react";

const GENRES = ["Amapiano", "Afrobeats", "Lo-fi", "Hip-Hop", "Gospel", "R&B", "Soul"];

export default function GenreTicker() {
  return (
    <div className="w-full lg:max-w-230 xl:max-w-300 border-y border-white/30 py-5 my-10 overflow-hidden flex items-center justify-center">
      <div className="flex items-center gap-5 sm:gap-7 whitespace-nowrap overflow-x-auto custom-scrollbar scroll-auto">
        {GENRES.concat(GENRES).map((genre, idx) => (
          <React.Fragment key={idx}>
            <span className="font-sans font-semibold text-[16px] text-text-muted hover:text-white transition-colors cursor-pointer">
              {genre}
            </span>
            <span className="w-0.75 h-0.75 rounded-full bg-primary-green shrink-0" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}