import Hero from "@/components/features/homepage/Hero";
import FragmentationSection from "@/components/features/homepage/FragmentationSection";
import OffersSection from "@/components/features/homepage/OffersSection";
import HowItWorks from "@/components/features/homepage/HowItWorks";
import CollaborationSection from "@/components/features/homepage/CollaborationSection";

export default function Home() {
  return (
    <div className="bg-white/30">
      <Hero />
      <FragmentationSection />
      <OffersSection />
      <HowItWorks />
      <CollaborationSection />
    </div>
  );
}
