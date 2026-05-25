import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackgroundPattern from "@/app/(marketing)/_components/background/BackgroundPattern";


export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Ba className="relative min-h-screen">
      <BackgroundPattern />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
