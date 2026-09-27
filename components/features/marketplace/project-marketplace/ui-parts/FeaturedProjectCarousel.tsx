import React, { useState } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiCheckCircle } from 'react-icons/hi';
import Button from '@/components/ui/Button';

export const FeaturedCarousel = ({ featuredProjects = [] }: { featuredProjects?: any[] }) => {
  const projects = featuredProjects;
  const [currentIndex, setCurrentIndex] = useState(0);
  if (projects.length === 0) return null;
  
    const nextSlide = () => {
      setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
    };
  
    const prevSlide = () => {
      setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
    };
  
    const project = projects[currentIndex];

  return (
    <div className="flex flex-col items-start mt-7 mb-7 w-full h-full">
      
      {/* Header Row */}
      <div className="flex justify-between items-center w-full">
        {/* Title & Subtitle */}
        <div className="flex flex-col">
          <h2 className="text-[15.94px] font-bold text-white leading-6 m-0">
            Featured Projects
          </h2>
          <p className="pt-[2.81px] text-[12.19px] font-normal text-white/60 leading-4.5 m-0">
            Hand-picked high-quality opportunities
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-[7.5px] h-[29.96px]">
          {/* Pagination Indicators */}
          <div className="hidden sm:flex items-center pr-[7.5px] gap-[5.63px] h-[5.59px]">
                      {projects.map((_, idx) => (
                        <div 
                          key={idx}
                          className={`h-[5.59px] rounded-[92.85px] transition-all duration-300 ${
                            currentIndex === idx ? 'w-[22.47px] bg-[#3B7BF5]' : 'w-[7.49px] bg-[#262626]'
                          }`} 
                        />
                      ))}
                    </div>

          {/* Arrow Buttons */}
          <button
            onClick={prevSlide}
            className="w-[29.96px] h-[29.96px] bg-white/15 hover:bg-white/20 transition-colors border border-border-muted/30 rounded-[14.98px] flex justify-center items-center shrink-0"
                      >
                        <HiOutlineChevronLeft className="w-[14.06px] h-[14.06px] text-white/50 hover:text-white" />
                      </button>
                      <button 
                        onClick={nextSlide}
                        className="w-[29.96px] h-[29.96px] bg-white/15 hover:bg-white/20 transition-colors border border-border-muted/30 rounded-[14.98px] flex justify-center items-center shrink-0"
                      >
                        <HiOutlineChevronRight className="w-[14.06px] h-[14.06px] text-white/50 hover:text-white" />
                      </button>
                    </div>
                  </div>

      {/* Carousel Card Container */}
      <div className="flex flex-col items-start pt-4 w-full h-full lg:h-80">
        <div className="flex flex-col lg:flex-row w-full h-full bg-black/15 border border-border-muted/35 rounded-2xl box-border overflow-hidden">
          
          {/* Left Image Section */}
          <div className="relative w-full lg:max-w-80 h-full shrink-0 isolate">
            <div 
              className="w-full h-[218.14px] lg:h-full bg-white/20 bg-cover bg-center"
              style={{ backgroundImage: project.image ? `url(${project.image})` : 'none' }}
            />
            {/* Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-black/20 to-transparent via-black/10 z-1" />
            
            {/* Badge */}
            <div className="absolute top-[11.23px] left-[11.24px] z-2">
              <div className="bg-black/50 rounded-full w-full h-6 flex items-center justify-center relative px-3">
                <span className="text-[11.26px] font-semibold text-text-muted leading-4.25">
                  {project.badge}
                </span>
              </div>
            </div>
          </div>

          {/* Right Content Section */}
          <div className="flex flex-col justify-between items-start px-6 py-6 w-full h-full">
            
            {/* Top Half */}
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-start">
                
                {/* Title & Author */}
                <div className="flex flex-col">
                  <h3 className="text-[18.76px] font-bold text-white leading-5.75 m-0">
                    {project.title}
                  </h3>
                  <div className="flex items-center pt-2 gap-[7.5px] h-[33.72px]">
                    <div className="flex justify-center items-center w-7 h-7 bg-accent-blue rounded-full text-[10.32px] font-bold text-white shrink-0">
                      {project.authorInitials}
                    </div>
                    <span className="text-[12.19px] font-medium text-text-muted leading-4.5">
                      {project.authorName}
                    </span>
                    <HiCheckCircle className="w-3.25 h-3.25 text-accent-blue shrink-0" />
                  </div>
                </div>

              </div>

              {/* Description */}
              <div className="flex flex-col items-start py-5 w-full">
                <p className="text-[12.19px] font-normal text-text-muted leading-5 m-0 w-full line-clamp-1">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Bottom Half */}
            <div className="flex justify-between items-end w-full">
              
              {/* Stats Block */}
             <div className="grid grid-cols-2 gap-y-4 gap-x-6 sm:flex sm:flex-wrap items-center sm:items-start sm:gap-6 w-full sm:w-auto mb-12 sm:mb-1.5">
                
                <div className="flex flex-col">
                  <span className="text-[9.38px] font-semibold text-white/[0.28] tracking-[0.47px] uppercase leading-3.5">
                    Timeline
                  </span>
                  <span className="pt-1 text-[12.19px] font-semibold text-white leading-4.5">
                    {project.timeline}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9.38px] font-semibold text-white/[0.28] tracking-[0.47px] uppercase leading-3.5">
                    Deadline
                  </span>
                  <span className="pt-1 text-[12.19px] font-semibold text-white leading-4.5">
                    {project.deadline}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9.38px] font-semibold text-white/[0.28] tracking-[0.47px] uppercase leading-3.5">
                    Compensation
                  </span>
                  <span className="pt-1 text-[12.19px] font-semibold text-white leading-4.5">
                    {project.compensation}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9.38px] font-semibold text-white/[0.28] tracking-[0.47px] uppercase leading-3.5">
                    Open Roles
                  </span>
                  <span className="pt-[2.81px] text-[12.19px] font-semibold text-secondary-blue leading-4.5">
                    {project.openRoles}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9.38px] font-semibold text-white/[0.28] tracking-[0.47px] uppercase leading-3.5">
                    Applicants
                  </span>
                  <span className="pt-1 text-[12.19px] font-semibold text-white leading-4.5">
                    {project.applicants}
                  </span>
                </div>

              </div>

              {/* View Project Button */}
              <Button className="flex flex-col justify-center items-center py-3 h-10">
                <span className="text-[12.19px] font-semibold text-white leading-4.5 text-center">
                  View Project
                </span>
              </Button>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
