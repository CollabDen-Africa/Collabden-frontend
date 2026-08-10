"use client";

import React from "react";

const STATS = [
  {
    number: "2,400+",
    label: "Verified creators",
    sub: "producers, vocalists, writers & engineers",
  },
  {
    number: "48",
    label: "Countries in the network",
    sub: "collabs across every timezone",
  },
  {
    number: "$1.2M+",
    label: "Paid out via escrow",
    sub: "zero payment disputes this year",
  },
  {
    number: "12k",
    label: "Collabs Shipped",
    sub: "released on major platforms",
  },
];

export default function MarketplaceStats() {
  return (
    <div className="w-full bg-primary-green/5 border-y border-primary-green py-12.5 px-5 lg:px-26 my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
        {STATS.map((stat, idx) => (
          <div key={idx} className="flex items-center gap-5">
            {/* Vertical Accent Line */}
            <div className="w-0.5 h-27.75 bg-primary-green shrink-0" />

            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <span className="font-sans font-extrabold text-[48px] leading-14 text-white/90">
                  {stat.number}
                </span>
                <span className="font-sans font-bold text-[20px] text-primary-green">
                  {stat.label}
                </span>
              </div>
              <span className="font-sans font-normal text-[16px] text-white/60">
                {stat.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}