import React from "react";

export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full relative font-sans bg-background text-foreground overflow-x-hidden">
      
      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[868px] h-[868px] left-[278px] top-[-156px] bg-primary-blue/70 rounded-full blur-[242.3px] opacity-90" />
        <div className="absolute w-[868px] h-[868px] left-[652px] top-[896px] bg-primary-blue rounded-full blur-[242.3px] opacity-90" />
        <div className="absolute w-[668px] h-[68px] left-[-434px] top-[609px] bg-primary-blue rounded-full blur-[242.3px] opacity-80" />
        <div className="absolute w-[1968px] h-[1868px] left-[756px] top-[843px] bg-primary-blue/70 rounded-full blur-[242.3px] opacity-80" />
        <div className="absolute inset-0 bg-accent-soft-blue/20" />
      </div>

      {/* Relative container */}
      <main className="relative z-10 w-full max-w-[1600px] mx-auto min-h-screen px-4 md:px-8 flex flex-col">
        {children}
      </main>
      
    </div>
  );
}