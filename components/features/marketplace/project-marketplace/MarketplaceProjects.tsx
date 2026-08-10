"use client";

import React, { useState } from 'react';
import { ProjectHeader } from './ui-parts/ProjectHeader';
import MarketplaceBrowsingSection from './MarketplaceBrowsingSection';
import { FeaturedCarousel } from './ui-parts/FeaturedProjectCarousel';
import { GenreFilters } from './ui-parts/GenreFilters';

export default function MarketplaceProjects() {
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const mockFeaturedProjects = [];

  return (
    <div className="w-full flex flex-col h-full animate-in fade-in duration-500">
      
      <header className="mb-8 flex flex-col justify-between gap-4">

        <div className="flex w-full my-2.5">
          <ProjectHeader />
        </div>
        
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Project Marketplace</h1>
          <p className="text-white/70 text-sm">
            Discover, pitch, and collaborate on high-quality projects.
          </p>
        </div>
      </header>

      <section className="w-full">
        {/* The new carousel replaces the static FeaturedProjectCard here */}
        <FeaturedCarousel featuredProjects={mockFeaturedProjects} />
      </section>

      <section className="w-full mb-8">
        <GenreFilters 
          selectedGenre={selectedGenre} 
          onSelect={setSelectedGenre} 
        />
      </section>
      
      <section className="w-full">
        <MarketplaceBrowsingSection 
          selectedGenre={selectedGenre} 
          onClearGenre={() => setSelectedGenre('All Genres')} 
        />
      </section>
    </div>
  );
}