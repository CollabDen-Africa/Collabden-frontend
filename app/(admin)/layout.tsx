import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CollabDen Admin Portal",
  description: "Administrative console for managing CollabDen.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#0d0f10] text-white font-sans overflow-x-hidden relative">
      {children}
    </div>
  );
}
