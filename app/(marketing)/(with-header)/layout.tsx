import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackgroundPattern from "../_components/background/BackgroundPattern";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white/30">
      <Navbar />
      <BackgroundPattern />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
