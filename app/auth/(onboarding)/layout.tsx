import React from 'react';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden px-4 py-10">
        
        {/* Ambient Blue Background Glows */}
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-[#204F99]/50 rounded-full mix-blend-screen filter blur-[230px] pointer-events-none z-0" />
        <div className="absolute top-[30%] right-[-10%] w-[800px] h-[800px] bg-[#204F99]/50 rounded-full mix-blend-screen filter blur-[230px] pointer-events-none z-0" />
        
        {/* Background Cyberpunk Headphones Image */}
        <div 
            className="absolute inset-0 z-0 opacity-40 bg-no-repeat bg-center"
            style={{ 
                backgroundImage: "url('/headphone.svg')", 
                backgroundSize: '700px',
                backgroundPosition: 'center 50%'
            }}
        />

        {/* Main Glassmorphism Card Wrapper */}
        <div className="relative z-10 w-full max-w-[1008px] min-h-[600px] lg:min-h-[858px] bg-white/15 backdrop-blur-xl border-2 border-white rounded-[40px] md:rounded-[50px] flex flex-col items-center justify-center p-8 md:p-16 shadow-2xl">
            
            {/* Individual page contents appear here */}
            {children}
            
        </div>
        
    </main>
  );
}