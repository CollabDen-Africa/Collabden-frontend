import Hero from "@/components/features/homepage/Hero";
import FragmentationSection from "@/components/features/homepage/FragmentationSection";
import OffersSection from "@/components/features/homepage/OffersSection";
import HowItWorks from "@/components/features/homepage/HowItWorks";
import CollaborationSection from "@/components/features/homepage/CollaborationSection";
import React from "react";
import MarketingPageWrapper from "@/components/layout/MarketingPageWrapper";

export default function Home() {
  return (
    <MarketingPageWrapper bgClass="bg-white/30">
      <Hero />
      <FragmentationSection />
      <OffersSection />
      <HowItWorks />
      <CollaborationSection />
    </MarketingPageWrapper>
  );
}

