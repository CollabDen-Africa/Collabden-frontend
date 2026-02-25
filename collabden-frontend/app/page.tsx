import Navbar from "./components/layout/Navbar";
import Hero from "./components/homepage/Hero";
import FragmentationSection from "./components/homepage/FragmentationSection";
import OffersSection from "./components/homepage/OffersSection";
import HowItWorks from "./components/homepage/HowItWorks";
import CollaborationSection from "./components/homepage/CollaborationSection";
import Footer from "./components/layout/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white/30">
      <Navbar />
      <main>
        <Hero />
        <FragmentationSection />
        <OffersSection />
        <HowItWorks />
        <CollaborationSection />
      </main>
      <Footer />
    </div>
  );
}
