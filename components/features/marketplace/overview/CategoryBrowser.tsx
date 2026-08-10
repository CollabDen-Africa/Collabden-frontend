"use client";

import React from "react";
import { HiArrowUp } from "react-icons/hi";

const CATEGORIES = [
  {
    title: "Producers",
    count: "860+ Creators",
    desc: "Beats, full production & sound design",
    image: "/mock-profiles/David.png",
  },
  {
    title: "Vocalists",
    count: "640+ Creators",
    desc: "Leads, stacks, hooks & ad-libs",
    image: "/mock-profiles/Tayo.png",
  },
  {
    title: "Songwriters",
    count: "520+ Creators",
    desc: "Toplines, lyrics & melody doctors",
    image: "/mock-profiles/small2.png",
  },
  {
    title: "Engineers",
    count: "380+ Creators",
    desc: "Mixing, mastering & spatial audio",
    image: "/mock-profiles/Sam.png",
  },
  {
    title: "Instrumentalists",
    count: "380+ Creators",
    desc: "Live instrumentation & sessions",
    image: "/mock-profiles/small3.png",
  },
];

interface CategoryBrowserProps {
  onCategoryClick?: (categoryTitle: string) => void;
}

export default function CategoryBrowser({ onCategoryClick }: CategoryBrowserProps) {
  return (
    <section className="flex flex-col w-full gap-8 my-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end w-full gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-sans font-semibold text-[28px] lg:text-[40px] leading-11.75 text-white">
            Every craft your record needs
          </h2>
          <p className="font-sans font-normal text-[18px] text-text-muted max-w-117.5">
            Four crafts, one den. Open a category to audition verified creators, hear their reels, and lock a collab in escrow.
          </p>
        </div>
      </div>

      {/* Grid of 5 Craft Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 w-full">
        {CATEGORIES.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => onCategoryClick && onCategoryClick(cat.title)}
            className="relative h-66.75 w-full rounded-[30px] overflow-hidden flex flex-col justify-end p-6 bg-cover bg-center border border-white/10 group cursor-pointer hover:border-primary-green transition-all shadow-lg"
            style={{ backgroundImage: `url(${cat.image})` }}
          >
            {/* Dark Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent group-hover:via-black/50 transition-colors" />

            {/* Top Right Action Button */}
            <div className="absolute top-4 right-4 w-6.25 h-6.25 bg-black/80 border border-border-muted/30 rounded-full flex items-center justify-center shadow-md group-hover:bg-primary-green group-hover:border-primary-green transition-colors z-10">
              <HiArrowUp className="text-primary-green group-hover:text-white transition-colors rotate-45" size={14} />
            </div>

            {/* Content Details */}
            <div className="relative z-10 flex flex-col gap-1">
              <span className="font-sans font-bold text-[10px] text-primary-green uppercase tracking-wider">
                {cat.count}
              </span>
              <h3 className="font-sans font-extrabold text-[20px] leading-5.75 text-white drop-shadow-md">
                {cat.title}
              </h3>
              <p className="font-sans font-medium text-[10px] text-text-muted leading-tight">
                {cat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}