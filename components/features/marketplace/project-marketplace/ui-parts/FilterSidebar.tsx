"use client";

import React, { useState } from 'react';
import { HiChevronRight, HiCheck } from 'react-icons/hi';
import { BsSliders } from 'react-icons/bs';

export function FilterSidebar({ 
  isMobileFiltersOpen = false, 
  filters = {}, 
  handleCheckboxToggle, 
  clearAllFilters, 
  filterCategories = [] 
}) {
  
  // Safe fallback 
  const categoriesToRender = filterCategories.length > 0 ? filterCategories : [
    { title: 'Role Needed', key: 'roles', options: ['Vocalist', 'Mixing Engineer', 'Mastering Engineer', 'Beatmaker', 'Composer', 'Session Guitar', 'Sound Designer'] },
    { title: 'Genre', key: 'genre', options: ['R&B', 'Electronic', 'Hip-Hop', 'Jazz', 'Folk', 'Ambient', 'Pop', 'Cinematic'] },
    { title: 'Project Status', key: 'status', options: [] },
    { title: 'Compensation', key: 'compensation', options: [] },
    { title: 'Timeline', key: 'timeline', options: [] },
    { title: 'Experience Level', key: 'experience', options: [] },
    { title: 'Quick Options', key: 'quickOptions', options: [] }
  ];

  return (
    <aside className={`w-54 h-max bg-white/15 border border-border-muted/30 rounded-2xl p-[16.88px_15.01px] md:mt-6 flex-col shrink-0 ${isMobileFiltersOpen ? 'flex' : 'hidden lg:flex'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between h-5 mb-4.5">
        <div className="flex items-center gap-1.75">
          <BsSliders className="w-3.5 h-3.5 text-white" />
          <span className="text-3.5 font-bold text-white leading-5">Filters</span>
        </div>
        
        {/* Reset Button */}
        {clearAllFilters && (
          <button 
            onClick={clearAllFilters} 
            className="text-[10px] font-semibold text-accent-soft-blue hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* Dynamic Filter Sections */}
      {categoriesToRender.map((category, idx) => (
        <FilterSection 
          key={category.key} 
          title={category.title} 
          defaultOpen={idx === 0 || category.key === 'genre'} 
          isLast={idx === categoriesToRender.length - 1}
        >
          {category.options?.map((option) => {
            const isChecked = filters[category.key]?.includes(option) || false;
            return (
              <label key={option} className="flex items-center py-1.25 gap-2.5 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={() => handleCheckboxToggle && handleCheckboxToggle(category.key, option)}
                    className="peer appearance-none w-3.5 h-3.5 border border-border-muted rounded-[3.75px] bg-transparent checked:bg-primary-green checked:border-primary-green transition-colors cursor-pointer" 
                  />
                  <HiCheck className="absolute text-white w-2.5 h-2.5 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                </div>
                <span className="text-[12.19px] font-normal text-text.muted leading-4.5 select-none group-hover:text-white/80 transition-colors">
                  {option}
                </span>
              </label>
            );
          })}
        </FilterSection>
      ))}
    </aside>
  );
}

function FilterSection({ title, children, defaultOpen = false, isLast = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasChildren = React.Children.count(children) > 0;

  return (
    <div className={`flex flex-col ${isLast ? '' : 'border-b border-border-muted mb-4'} pb-4`}>
      <button 
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className={`flex justify-between items-center w-full ${isOpen && hasChildren ? 'pb-2.5' : ''}`}
        disabled={!hasChildren}
      >
        <span className="text-[10.32px] font-bold text-white/[0.28] uppercase tracking-[0.62px] leading-3.75">
          {title}
        </span>
        <HiChevronRight className={`w-3.25 h-[12.16px] text-white/[0.28] transition-transform ${isOpen && hasChildren ? 'rotate-90' : ''} ${!hasChildren ? 'opacity-30' : ''}`} />
      </button>
      
      {isOpen && hasChildren && (
        <div className="flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
}