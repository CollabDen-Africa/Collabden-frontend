"use client";

import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiFilter, FiChevronDown, FiGrid, FiList } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { FilterSidebar } from './ui-parts/FilterSidebar';
import { ProjectListCard } from './ui-parts/ProjectListCard';
import { ProjectGridCard } from './ui-parts/ProjectGridCard';
import { ApplicationModalManager } from './application-modal/ApplicationModalManager';
import { ProjectSummaryModal } from './ProjectSummaryModal';
import { Pagination } from '@/components/ui/Pagination';

interface Project {
  id: string;
  title: string;
  description: string;
  genres: string[];
  roles: string[];
  compensation: string;
  duration: string;
  deadline: string;
  applicants: number;
  authorName: string;
  authorInitials: string;
  postedAt: string;
  isUrgent?: boolean;
  openRolesCount: number;
  image: string;
  coverImageUrl?: string | null;
  isOwner?: boolean;
  hasPendingApplication?: boolean;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Only backend-supported filter keys live in this component now.
// compensationType / status / timeline / experience / quickOptions are sidebar-only
// UI state until the backend adds support for them.
const FILTER_CATEGORIES = [
  { title: 'Role Needed', key: 'roles' as const, options: ['Vocalist', 'Mixing Engineer', 'Mastering Engineer', 'Beatmaker', 'Composer', 'Session Guitar', 'Sound Designer'] },
  { title: 'Project Status', key: 'status' as const, options: ['Accepting Pitches', 'In Progress', 'Almost Full'] },
  { title: 'Compensation', key: 'compensationType' as const, options: ['Paid / Budget', 'Royalty Split', 'Unpaid / Collab'] },
  { title: 'Timeline', key: 'timeline' as const, options: ['< 1 Month', '1-3 Months', '3-6 Months', 'Long-term'] },
  { title: 'Experience Level', key: 'experience' as const, options: ['Beginner', 'Intermediate', 'Expert'] },
  { title: 'Quick Options', key: 'quickOptions' as const, options: ['Escrow Protected', 'Deadline Soon'] },
];

interface BrowsingSectionProps {
  projects: Project[];
  meta: Meta;
  isLoading?: boolean;
  // Filter state owned by parent (wired to backend query)
  selectedGenre: string;
  onClearGenre: () => void;
  selectedRoles: string[];
  onRoleToggle: (role: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function MarketplaceBrowsingSection({
  projects,
  meta,
  isLoading,
  selectedGenre,
  onClearGenre,
  selectedRoles,
  onRoleToggle,
  sortBy,
  onSortChange,
  currentPage,
  onPageChange,
}: BrowsingSectionProps) {
  const router = useRouter();

  // Local UI state only
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [applyingProject, setApplyingProject] = useState<Project | null>(null);
  const [viewingSummaryProject, setViewingSummaryProject] = useState<Project | null>(null);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  const searchParams = useSearchParams();
  const urlProjectId = searchParams.get('projectId');

  // Auto-open the Project Summary Modal if the URL contains a projectId
  React.useEffect(() => {
    if (urlProjectId && projects.length > 0 && !hasAutoOpened) {
      const projectToOpen = projects.find((p) => p.id === urlProjectId);
      if (projectToOpen) {
        setViewingSummaryProject(projectToOpen);
        setHasAutoOpened(true);
      }
    }
  }, [urlProjectId, projects, hasAutoOpened]);

  // Bridge selectedRoles → FilterSidebar's expected shape.
  // Other filter keys are kept as local UI state but not yet wired to the backend.
  const [localFilters, setLocalFilters] = useState({
    status: [] as string[],
    compensationType: [] as string[],
    timeline: [] as string[],
    experience: [] as string[],
    quickOptions: [] as string[],
  });

  const handleCheckboxToggle = (categoryKey: string, option: string) => {
    if (categoryKey === 'roles') {
      onRoleToggle(option);
      return;
    }
    setLocalFilters((prev) => {
      const key = categoryKey as keyof typeof localFilters;
      const current = prev[key];
      return {
        ...prev,
        [key]: current.includes(option) ? current.filter((i) => i !== option) : [...current, option],
      };
    });
  };

  const clearAllFilters = () => {
    onClearGenre();
    setLocalFilters({ status: [], compensationType: [], timeline: [], experience: [], quickOptions: [] });
  };

  // Sidebar receives a unified filters shape
  const sidebarFilters = { roles: selectedRoles, genre: [] as string[], ...localFilters };

  const totalPages = meta.totalPages || 1;
  const totalItems = meta.total || 0;

  return (
    <div id="project-directory" className="w-full flex flex-col scroll-mt-30">

      <ApplicationModalManager
        isOpen={!!applyingProject}
        onClose={() => setApplyingProject(null)}
        project={applyingProject}
      />

      <ProjectSummaryModal
        isOpen={!!viewingSummaryProject}
        onClose={() => setViewingSummaryProject(null)}
        onApply={(proj) => {
          setViewingSummaryProject(null);
          setApplyingProject(proj);
        }}
        project={viewingSummaryProject}
      />

      <div className="lg:hidden w-full mb-4 mt-2">
        <Button
          variant="outline"
          size="sm"
          icon={FiFilter}
          iconPosition="left"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="w-full bg-white/15 border border-border-muted/30 text-text-muted"
        >
          {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-5.5 w-full mt-2">

        <FilterSidebar
          isMobileFiltersOpen={isMobileFiltersOpen}
          filters={sidebarFilters}
          handleCheckboxToggle={handleCheckboxToggle}
          clearAllFilters={clearAllFilters}
          filterCategories={FILTER_CATEGORIES}
        />

        <div className="flex-1 w-full min-w-0">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-text-muted text-[13px]">
              {isLoading ? (
                <span className="text-white/40">Loading…</span>
              ) : (
                <><span className="text-white font-medium">{totalItems}</span> projects found</>
              )}
            </p>

            <div className="flex items-center gap-3.75">
              <div className="relative flex items-center gap-[7.5px] text-sm">
                <span className="text-white/30 text-[11px] font-medium">Sort by:</span>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center justify-between gap-2 text-text-muted bg-white/15 border border-border-muted/30 px-4 py-2.25 rounded-lg hover:text-white transition-colors"
                >
                  <span className="text-[12px]">{sortBy}</span>
                  <FiChevronDown size={14} className="text-muted/70" />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 top-11 w-44 bg-white/15 border border-border-muted/30 backdrop-blur-sm rounded-[15px] shadow-xl z-20 py-2">
                    {['Most Relevant', 'Newest', 'Highest Budget'].map((option) => (
                      <button
                        key={option}
                        onClick={() => { onSortChange(option); setIsSortOpen(false); }}
                        className="w-full text-left px-4.25 py-2 text-[12px] text-white/50 hover:bg-white/15 hover:text-white transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center bg-white/15 border border-border-muted/30 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`w-8 h-8 flex items-center justify-center transition-colors border-r border-border-muted/30 ${viewMode === 'grid' ? 'bg-primary-blue text-white' : 'bg-transparent text-white/30 hover:text-white'}`}
                >
                  <FiGrid size={12} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`w-8 h-8 flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-primary-blue text-white' : 'bg-transparent text-white/30 hover:text-white'}`}
                >
                  <FiList size={12} />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-white/60">Loading marketplace projects…</div>
          ) : projects.length === 0 ? (
            <div className="bg-white/15 border border-border-muted rounded-[15px] p-7.5 text-center">
              <p className="text-text-muted text-[13px] mb-2">No projects found matching your criteria.</p>
              <button
                onClick={clearAllFilters}
                className="text-[14px] text-secondary-blue hover:underline font-medium"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6' : 'flex flex-col gap-5'}>
                {projects.map((project) =>
                  viewMode === 'grid' ? (
                    <ProjectGridCard
                      key={project.id}
                      project={project}
                      onApply={() => setApplyingProject(project)}
                      onView={() => project.isOwner ? router.push(`/workspace?projectId=${project.id}`) : setViewingSummaryProject(project)}
                    />
                  ) : (
                    <ProjectListCard
                      key={project.id}
                      project={project}
                      onApply={() => setApplyingProject(project)}
                      onView={() => project.isOwner ? router.push(`/workspace?projectId=${project.id}`) : setViewingSummaryProject(project)}
                    />
                  )
                )}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                currentItemsCount={projects.length}
                totalItems={totalItems}
                itemName="projects"
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
