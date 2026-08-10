"use client";

import React, { useState } from 'react';
import { FiFilter, FiChevronDown, FiGrid, FiList } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { FilterSidebar } from './ui-parts/FilterSidebar';
import { ProjectListCard } from './ui-parts/ProjectListCard';
import { ProjectGridCard } from './ui-parts/ProjectGridCard';
import { ApplicationModalManager } from './application-modal/ApplicationModalManager';
import { ProjectsYouMayLike } from './ui-parts/RecommendedProjects';
import { Pagination } from '@/components/ui/Pagination';

// --- Types & Mock Data ---
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
  isUrgent: boolean;
  openRolesCount: number;
  image: string;
  
  // Kept these properties strictly so your FilterSidebar categories don't break
  compensationType: 'Paid / Budget' | 'Royalty Split' | 'Unpaid / Collab';
  status: 'Accepting Pitches' | 'In Progress' | 'Almost Full';
  isEscrowProtected: boolean;
}

const ALL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Sci-Fi Short Film Scoring',
    description: 'Looking for a synth-heavy composer to score a 15-minute indie sci-fi short. References include Blade Runner and Dune.',
    genres: ['Cinematic', 'Electronic'],
    roles: ['Composer', 'Sound Designer'],
    compensation: '$800',
    duration: '2 Weeks',
    deadline: 'Aug 22, 2026',
    applicants: 4,
    authorName: 'Sarah Jenkins',
    authorInitials: 'SJ',
    postedAt: '2 days ago',
    isUrgent: true,
    openRolesCount: 2,
    compensationType: 'Paid / Budget',
    status: 'Accepting Pitches',
    isEscrowProtected: true,
    image: '/Ambient.png',
  },
  {
    id: '2',
    title: 'Neon Soul — R&B Album Production',
    description: 'Looking for experienced vocalists and beatmakers to collaborate on a 7-track neo-soul project. Stems provided.',
    genres: ['R&B', 'Neo-Soul'],
    roles: ['Vocalist', 'Beatmaker'],
    compensation: '50% Split',
    duration: '4 Weeks',
    deadline: 'Sep 15, 2026',
    applicants: 12,
    authorName: 'Emmanuel Osei',
    authorInitials: 'EO',
    postedAt: '5 hours ago',
    isUrgent: false,
    openRolesCount: 2,
    compensationType: 'Royalty Split',
    status: 'Accepting Pitches',
    isEscrowProtected: true,
    image: '/Jazz.png',
  },
  {
    id: '3',
    title: 'Lo-Fi Chillhop Compilation',
    description: 'Need smooth instrumental beatmakers for an upcoming seasonal Spotify compilation album.',
    genres: ['Electronic', 'Lo-Fi'],
    roles: ['Beatmaker'],
    compensation: '$400',
    duration: '1 Week',
    deadline: 'Aug 15, 2026',
    applicants: 28,
    authorName: 'Marcus King',
    authorInitials: 'MK',
    postedAt: '1 week ago',
    isUrgent: true,
    openRolesCount: 1,
    compensationType: 'Paid / Budget',
    status: 'Almost Full',
    isEscrowProtected: true,
    image: '/Hip-Hop.png',
  },
  {
    id: '4',
    title: 'Lo-Fi Chillhop Compilation',
    description: 'Need smooth instrumental beatmakers for an upcoming seasonal Spotify compilation album.',
    genres: ['Electronic', 'Lo-Fi'],
    roles: ['Beatmaker'],
    compensation: '$400',
    duration: '1 Week',
    deadline: 'Aug 15, 2026',
    applicants: 28,
    authorName: 'Marcus King',
    authorInitials: 'MK',
    postedAt: '1 week ago',
    isUrgent: true,
    openRolesCount: 1,
    compensationType: 'Paid / Budget',
    status: 'Almost Full',
    isEscrowProtected: true,
    image: '/Hip-Hop.png',
  },
];

const FILTER_CATEGORIES = [
  { title: 'Role Needed', key: 'roles' as const, options: ['Vocalist', 'Mixing Engineer', 'Mastering Engineer', 'Beatmaker', 'Composer', 'Session Guitar', 'Sound Designer'] },
  { title: 'Genre', key: 'genre' as const, options: ['R&B', 'Electronic', 'Hip-Hop', 'Jazz', 'Folk', 'Ambient', 'Pop', 'Cinematic'] },
  { title: 'Project Status', key: 'status' as const, options: ['Accepting Pitches', 'In Progress', 'Almost Full'] },
  { title: 'Compensation', key: 'compensationType' as const, options: ['Paid / Budget', 'Royalty Split', 'Unpaid / Collab'] },
  { title: 'Timeline', key: 'timeline' as const, options: ['< 1 Month', '1-3 Months', '3-6 Months', 'Long-term'] },
  { title: 'Experience Level', key: 'experience' as const, options: ['Beginner', 'Intermediate', 'Expert'] },
  { title: 'Quick Options', key: 'quickOptions' as const, options: ['Escrow Protected', 'Deadline Soon'] }
];

interface BrowsingSectionProps {
  selectedGenre: string;
  onClearGenre: () => void;
}

export default function MarketplaceBrowsingSection({ selectedGenre, onClearGenre }: BrowsingSectionProps) {
  // --- State ---
  const [filters, setFilters] = useState<{
    roles: string[];
        genre: string[];
        compensationType: string[];
        status: string[];
        timeline: string[];
        experience: string[];
        quickOptions: string[];
      }>({
        roles: [],
        genre: [],
        compensationType: [],
        status: [],
        timeline: [],
        experience: [],
        quickOptions: [],
  });
  
  const [sortBy, setSortBy] = useState<string>('Most Relevant');
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [applyingProject, setApplyingProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 2; //For testing (to be changed)

  // --- Handlers ---
  const handleCheckboxToggle = (categoryKey: keyof typeof filters, option: string) => {
    setFilters(prev => {
      const currentList = prev[categoryKey];
      const exists = currentList.includes(option);
      return {
        ...prev,
        [categoryKey]: exists 
          ? currentList.filter(item => item !== option)
          : [...currentList, option]
      };
    });
  };

  const clearAllFilters = () => {
      onClearGenre();
      setFilters({ 
        roles: [], 
        genre: [],
        compensationType: [], 
        status: [],
        timeline: [],
        experience: [],
        quickOptions: []
      });
    };
  
    // --- Derived State ---
    const filteredProjects = ALL_PROJECTS.filter(project => {
      // Top level pill filter
      if (selectedGenre !== 'All Genres' && !project.genres.includes(selectedGenre)) return false;
      
      // Sidebar Checkbox filters
      if (filters.roles.length > 0 && !project.roles.some(r => filters.roles.includes(r))) return false;
      if (filters.genre.length > 0 && !project.genres.some(g => filters.genre.includes(g))) return false;
      if (filters.compensationType.length > 0 && !filters.compensationType.includes(project.compensationType)) return false;
      if (filters.status.length > 0 && !filters.status.includes(project.status)) return false;
      
      // Quick Options
      if (filters.quickOptions.includes('Escrow Protected') && !project.isEscrowProtected) return false;
      if (filters.quickOptions.includes('Deadline Soon') && !project.isUrgent) return false;
      
      return true;
    });

    // --- Pagination Logic ---
      const totalItems = filteredProjects.length;
      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const paginatedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div id="project-directory" className="w-full flex flex-col scroll-mt-30">

      <ApplicationModalManager 
              isOpen={!!applyingProject} 
              onClose={() => setApplyingProject(null)} 
              project={applyingProject} 
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
          filters={filters}
          handleCheckboxToggle={handleCheckboxToggle}
          clearAllFilters={clearAllFilters}
          filterCategories={FILTER_CATEGORIES}
        />

        <div className="flex-1 w-full min-w-0">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-text-muted text-[13px]">
              <span className="text-white font-medium">{filteredProjects.length}</span> projects found
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
                    {['Most Relevant', 'Newest', 'Highest Budget'].map(option => (
                      <button
                        key={option}
                        onClick={() => { setSortBy(option); setIsSortOpen(false); }}
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

          {filteredProjects.length === 0 ? (
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
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6" : "flex flex-col gap-5"}>
              {paginatedProjects.map((project) => (
                viewMode === 'grid' 
                  ? <ProjectGridCard key={project.id} project={project} onApply={() => setApplyingProject(project)} /> 
                  : <ProjectListCard key={project.id} project={project} onApply={() => setApplyingProject(project)} />
              ))}
                </div>

                {/* Pagination */}
                   <Pagination 
                        currentPage={currentPage}
                         totalPages={totalPages}
                         onPageChange={setCurrentPage}
                         currentItemsCount={paginatedProjects.length}
                         totalItems={totalItems}
                         itemName="projects"
                              />
                  </div>
          )}

          <section className="w-full pb-16">
                  <ProjectsYouMayLike />
                </section>
        </div>
      </div>
    </div>
  );
}