"use client";

import React, { useMemo, useState } from 'react';
import { ProjectHeader } from './ui-parts/ProjectHeader';
import MarketplaceBrowsingSection from './MarketplaceBrowsingSection';
import { FeaturedCarousel } from './ui-parts/FeaturedProjectCarousel';
import { GenreFilters } from './ui-parts/GenreFilters';
import { useProjects } from '@/hooks/projects/useProjects';
import { useAuth } from '@/context/AuthContext';

const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
    : 'Not specified';

const ITEMS_PER_PAGE = 6;

const sortParamsMap: Record<string, { sortBy?: string; sortOrder?: 'asc' | 'desc' }> = {
  'Most Relevant': {},
  'Newest': { sortBy: 'createdAt', sortOrder: 'desc' },
  'Highest Budget': { sortBy: 'budget', sortOrder: 'desc' },
};

export default function MarketplaceProjects() {
  const { user } = useAuth();
  const { useMarketplaceProjects, useMyApplications } = useProjects();

  // --- Filter state (owned here, passed to backend query) ---
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('Most Relevant');

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
    setPage(1);
  };

  const handleRoleToggle = (role: string) => {
    setSelectedRoles((prev) => {
      const next = prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role];
      setPage(1);
      return next;
    });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setPage(1);
  };

  const handlePageChange = (p: number) => setPage(p);

  const handleClearFilters = () => {
    setSelectedGenre('All Genres');
    setSelectedRoles([]);
    setSortBy('Most Relevant');
    setPage(1);
  };

  // --- Backend query ---
  const queryFilters = {
    genre: selectedGenre !== 'All Genres' ? selectedGenre : undefined,
    // Backend takes a single role — if multiple are selected we send the first;
    // the browsing section still visually reflects all selected roles.
    role: selectedRoles.length > 0 ? selectedRoles[0] : undefined,
    page,
    limit: ITEMS_PER_PAGE,
    ...sortParamsMap[sortBy],
  };

  const { data, isLoading, isError } = useMarketplaceProjects(queryFilters);
  const { data: myApplications = [] } = useMyApplications();

  const projects = useMemo(() => (data?.projects || []).map((project) => {
    const isCollaborator = Boolean(
      user?.id &&
      ((project as any).collaborators || []).some(
        (c: any) => (c.userId === user.id || c.user?.id === user.id) && c.isActive !== false
      )
    );
    const isOwner = Boolean(
      user?.id &&
      (project.owner?.id === user.id || (project as any).ownerId === user.id || isCollaborator)
    );
    const hasPendingApplication = Array.isArray(myApplications) && myApplications.some(
      (app: any) => app.projectId === project.id && app.status === 'PENDING'
    );

    return {
      id: project.id,
      title: project.name,
      description: project.description || 'No description provided.',
      genres: project.genre ? [project.genre] : [],
      roles: project.requiredRoles || [],
      compensation:
        project.budget !== null && project.budget !== undefined
          ? `${project.pricingType === 'hourly' ? '' : 'Budget '}₦${Number(project.budget).toLocaleString()}`
          : 'Not specified',
      duration:
        project.startDate && project.endDate
          ? `${formatDate(project.startDate)} – ${formatDate(project.endDate)}`
          : 'Not specified',
      deadline: formatDate(project.endDate),
      applicants: project._count?.applications || 0,
      authorName:
        project.owner?.displayName ||
        project.owner?.legalName ||
        project.owner?.email?.split('@')[0] ||
        'Project owner',
      authorInitials: (
        project.owner?.displayName ||
        project.owner?.legalName ||
        project.owner?.email ||
        'PO'
      ).slice(0, 2).toUpperCase(),
      postedAt: formatDate(project.createdAt),
      openRolesCount: project.requiredRoles?.length || 0,
      badge: project.genre || 'Project',
      openRoles: `${project.requiredRoles?.length || 0} position${(project.requiredRoles?.length || 0) === 1 ? '' : 's'}`,
      image: '',
      coverImageUrl: project.coverImageUrl || null,
      isOwner,
      hasPendingApplication,
    };
  }), [data, myApplications, user]);

  const meta = data?.meta ?? { total: 0, page: 1, limit: ITEMS_PER_PAGE, totalPages: 1 };

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
        <FeaturedCarousel featuredProjects={projects.slice(0, 5)} />
      </section>

      <section className="w-full mb-8">
        <GenreFilters selectedGenre={selectedGenre} onSelect={handleGenreSelect} />
      </section>

      <section className="w-full">
        {isError ? (
          <div className="py-12 text-center text-red-300">Unable to load marketplace projects.</div>
        ) : (
          <MarketplaceBrowsingSection
            projects={projects}
            meta={meta}
            isLoading={isLoading}
            selectedGenre={selectedGenre}
            onClearGenre={handleClearFilters}
            selectedRoles={selectedRoles}
            onRoleToggle={handleRoleToggle}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </div>
  );
}
