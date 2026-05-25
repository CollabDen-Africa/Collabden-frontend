"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiArrowRight } from "react-icons/hi";
import { ROUTES } from '@/constants/routes';
import { useUpdateOnboarding } from '@/hooks/auth/useUpdateOnboarding';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const SLIDES = [
  {
    id: 1,
    title: "Share Your Sound Without Losing Its Quality",
    description: "Upload and send your tracks in their original quality, so every detail sounds exactly the way you created it.",
    image: "/Mask I.png",
    bgPosition: "bg-left",
  },
  {
    id: 2,
    title: "Create together without the usual risks",
    description: "Work with others seamlessly while keeping your contributions protected and your payments secure, all in one place.",
    image: "/Mask II.png",
    bgPosition: "bg-left",
  },
  {
    id: 3,
    title: "Find the right collaborators",
    description: "Connect with creatives, join projects that match your vision, and earn from the work you do.",
    image: "/Mask III.png",
    bgPosition: "bg-bottom",
  }
];

export default function OnboardingIntroPage() {
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const updateOnboardingMutation = useUpdateOnboarding();

  const handleComplete = async () => {
    try {
      // 1. Notify backend via hook
      await updateOnboardingMutation.mutateAsync({ hasCompletedOnboarding: true });
      
      // 2. Set local flag for UI tours/tooltips
      localStorage.setItem('collabden_onboarding_complete', 'true');
      
      // 3. Navigate to dashboard
      router.push(ROUTES.DASHBOARD.ROOT);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      // Fallback to dashboard anyway to not block the user
      router.push(ROUTES.DASHBOARD.ROOT);
    }
  };

  const handleNext = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setDirection(1);
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setDirection(-1);
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const slide = SLIDES[currentSlideIndex];

  // Framer Motion variants for slide transition
  const textVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" }
    })
  };

  const imageVariants: Variants = {
    enter: {
      opacity: 0,
      scale: 1.05
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.4, ease: "easeIn" }
    }
  };

  return (
    <main className="relative min-h-screen w-full flex bg-white overflow-hidden font-raleway z-10">
      
      {/* Left Column (Content) */}
      <div className="w-full lg:w-[520px] relative flex flex-col justify-center items-center px-6 py-20 shrink-0 bg-white">
        
        {/* Skip Button - Top Left (Only visible on slides 1 & 2) */}
        {currentSlideIndex < SLIDES.length - 1 && (
          <button 
            onClick={handleComplete}
            className="absolute top-8 left-8 md:top-[63px] md:left-[41px] flex justify-center items-center px-[15px] py-[4px] border border-dashed border-[#878A8B] rounded-[50px] hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span className="text-[16px] leading-[22px] text-[#878A8B] font-sfpro">
              Skip
            </span>
          </button>
        )}

        {/* Back Button - Top Right (Visible on slide 2 & 3) */}
        {currentSlideIndex > 0 && (
          <button 
            onClick={handlePrev}
            className="absolute top-8 right-8 md:top-[63px] md:right-[41px] flex justify-center items-center px-[15px] py-[4px] border border-[#878A8B] rounded-[50px] hover:bg-gray-50 transition-colors text-[#878A8B] text-[14px] cursor-pointer"
          >
            Back
          </button>
        )}

        {/* Main Content Wrapper */}
        <div className="w-full max-w-[419px] flex flex-col items-center gap-[48px] overflow-hidden">
          
          {/* Text & Progress Group */}
          <div className="flex flex-col items-center gap-[40px] w-full">
            
            {/* Progress Indicators */}
            <div className="flex flex-row items-center gap-[19px]">
              {SLIDES.map((s, idx) => (
                <div 
                  key={s.id}
                  onClick={() => {
                    setDirection(idx > currentSlideIndex ? 1 : -1);
                    setCurrentSlideIndex(idx);
                  }}
                  className={`h-[4px] rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentSlideIndex 
                      ? "w-[80px] bg-[#73BF44]" 
                      : "w-[80px] bg-[#D9D9D9] hover:bg-gray-400"
                  }`} 
                />
              ))}
            </div>

            {/* Text Content */}
            <div className="w-full min-h-[160px] relative flex flex-col justify-center">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentSlideIndex}
                  custom={direction}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex flex-col items-center gap-[16px]"
                >
                  <h1 className="text-[32px] leading-[40px] font-semibold text-black text-center max-w-[380px]">
                    {slide.title}
                  </h1>
                  <p className="text-[18px] leading-[28px] font-medium text-[#434C4F] text-center max-w-[372px]">
                    {slide.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* Action Button */}
          <button 
            onClick={handleNext}
            disabled={updateOnboardingMutation.isPending}
            className="flex flex-row items-center justify-center px-[28px] py-[14px] gap-[10px] bg-[#73BF44] hover:bg-[#62a538] disabled:opacity-70 transition-colors rounded-[50px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] group cursor-pointer"
          >
            <span className="text-[18px] leading-[21px] font-bold text-white whitespace-nowrap">
              {updateOnboardingMutation.isPending 
                ? "Finishing..." 
                : currentSlideIndex === SLIDES.length - 1 
                  ? "Start Exploring" 
                  : "Continue"}
            </span>
            {/* Circular Arrow Icon Container */}
            <div className="w-[28px] h-[28px] bg-white rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
              <HiArrowRight className="w-4 h-4 text-[#73BF44]" />
            </div>
          </button>

        </div>
      </div>

      {/* Illustration Mask (Right side) */}
      <div className="hidden lg:block flex-1 relative overflow-hidden my-0 h-full bg-[#FAFAFA]">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentSlideIndex}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className={`absolute inset-0 w-full h-full bg-cover ${slide.bgPosition}`}
            style={{ 
              backgroundImage: `url('${slide.image}')`, 
            }}
          />
        </AnimatePresence>
      </div>

    </main>
  );
}
