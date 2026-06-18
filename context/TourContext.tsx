// For proper rendering of the tooltips
"use client";
import { createContext, useContext } from 'react';

export interface TourContextType {
  currentStep: number;
  setStep: (step: number) => void;
  onSkip: () => void;
  isTourActive: boolean;
}

export const TourContext = createContext<TourContextType | null>(null);

export const useTour = (): TourContextType => {
  const context = useContext(TourContext);
  // Default values for cases where the context might be missing (like static rendering or outside the layout)
  if (!context) {
    return {
      currentStep: 0,
      setStep: () => {},
      onSkip: () => {},
      isTourActive: false,
    };
  }
  return context;
};