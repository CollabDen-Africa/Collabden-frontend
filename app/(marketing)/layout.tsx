import React from "react";
import BackgroundPattern from "@/app/(marketing)/_components/background/BackgroundPattern";


export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <BackgroundPattern />
      <main>{children}</main>
    </div>
  );
}
