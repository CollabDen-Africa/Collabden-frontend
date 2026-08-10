"use client";

import React from "react";
// Ensure this path correctly points to your CollaboratorCard component
import CollaboratorCard from "@/components/features/marketplace/collab-search/CollaboratorCard"; 

const CREATORS = [
  {
    name: "Yemi Sounds",
    role: "Music Producer · Lagos, NG · 8y exp",
    bio: "Award-winning producer with 8 years crafting chart-topping hits across Afrobeats, R&B, and Hip-Hop.",
    genres: ["Afrobeats", "R&B", "Hip-Hop"],
    projects: 25,
    rating: 4.5,
    endorsements: 88,
    image: "/mock-profiles/David.png",
  },
  {
    name: "Tim Martin",
    role: "Vocalist & Topliner · London, UK · 6y exp",
    bio: "Soulful vocal delivery and catchy hook arrangements designed for commercial radio success.",
    genres: ["R&B Soul", "Pop", "Afrobeats"],
    projects: 19,
    rating: 4.9,
    endorsements: 64,
    image: "/mock-profiles/Tayo.png",
  },
  {
    name: "Andre Collins",
    role: "Mixing & Mastering Engineer · Atlanta, US · 10y exp",
    bio: "Precision mixing and spatial audio specialist ensuring your mix translates perfectly on all sound systems.",
    genres: ["Hip-Hop", "Trap", "Pop"],
    projects: 42,
    rating: 4.8,
    endorsements: 112,
    image: "/mock-profiles/small2.png",
  },
];

interface FeaturedCreatorsProps {
  onSearch: () => void;
}

export default function FeaturedCreators({ onSearch }: FeaturedCreatorsProps) {
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
          View all 2400+ creators
        </button>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 w-full">
        {CREATORS.map((creator, idx) => (
          <CollaboratorCard key={idx} {...creator} />
        ))}
      </div>
    </section>
  );
}