"use client";

import React, { useMemo, useState } from 'react';
import { ProjectHeader } from './ui-parts/ProjectHeader';
import MarketplaceBrowsingSection from './MarketplaceBrowsingSection';
import { FeaturedCarousel } from './ui-parts/FeaturedProjectCarousel';
import { GenreFilters } from './ui-parts/GenreFilters';
import { useProjects } from '@/hooks/projects/useProjects';

const formatDate = (value?: string | null) => value ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value)) : 'Not specified';

export default function MarketplaceProjects() {
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const { useMarketplaceProjects } = useProjects();
  const { data, isLoading, isError } = useMarketplaceProjects({ limit: 100 });
  const projects = useMemo(() => (data?.projects || []).map((project) => ({
    id: project.id,
    title: project.name,
    description: project.description || 'No description provided.',
    genres: project.genre ? [project.genre] : [],
    roles: project.requiredRoles || [],
    compensation: project.budget !== null && project.budget !== undefined ? `${project.pricingType === 'hourly' ? '' : 'Budget '}₦${Number(project.budget).toLocaleString()}` : 'Not specified',
    duration: project.startDate && project.endDate ? `${formatDate(project.startDate)} – ${formatDate(project.endDate)}` : 'Not specified',
    deadline: formatDate(project.endDate),
    applicants: project._count?.applications || 0,
    authorName: project.owner?.displayName || project.owner?.legalName || project.owner?.email?.split('@')[0] || 'Project owner',
    authorInitials: (project.owner?.displayName || project.owner?.legalName || project.owner?.email || 'PO').slice(0, 2).toUpperCase(),
    postedAt: formatDate(project.createdAt),
    openRolesCount: project.requiredRoles?.length || 0,
    badge: project.genre || 'Project',
    openRoles: `${project.requiredRoles?.length || 0} position${(project.requiredRoles?.length || 0) === 1 ? '' : 's'}`,
    image: '',
  })), [data]);

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
        <FeaturedCarousel featuredProjects={projects.slice(0, 5)} />
      </section>

      <section className="w-full mb-8">
        <GenreFilters 
          selectedGenre={selectedGenre} 
          onSelect={setSelectedGenre} 
        />
      </section>
      
      <section className="w-full">
        {isLoading ? <div className="py-12 text-center text-white/60">Loading marketplace projects…</div> : isError ? <div className="py-12 text-center text-red-300">Unable to load marketplace projects.</div> : <MarketplaceBrowsingSection
          selectedGenre={selectedGenre} 
          onClearGenre={() => setSelectedGenre('All Genres')} 
          projects={projects}
        />}
      </section>
    </div>
  );
}
