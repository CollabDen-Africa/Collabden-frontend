import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface MarketingPageWrapperProps {
  children: React.ReactNode;
  bgClass?: string;
  className?: string;
}

export default function MarketingPageWrapper({
  children,
  bgClass = "bg-white/30",
  className = "",
}: MarketingPageWrapperProps) {
  return (
    <div className={`relative min-h-screen ${bgClass} ${className}`}>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
