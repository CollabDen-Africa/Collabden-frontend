import React from 'react';
import Link from 'next/link';
import { HiArrowRight } from "react-icons/hi";
import { ROUTES } from '@/constants/routes';

export default function IntroSlideTwoPage() {
    return (
        <main className="relative min-h-screen w-full flex bg-white overflow-hidden font-raleway">
            
            {/* Left Column (Content) */}
            <div className="w-full lg:w-[520px] relative flex flex-col justify-center items-center px-6 py-20 shrink-0">
                
                {/* Skip Button */}
                <Link 
                    href={ROUTES.DASHBOARD.ROOT} 
                    className="absolute top-8 left-8 md:top-[63px] md:left-[41px] flex justify-center items-center px-[15px] py-[4px] border border-dashed border-[#878A8B] rounded-[50px] hover:bg-gray-50 transition-colors z-10"
                >
                    <span className="text-[16px] leading-[22px] text-[#878A8B] font-sfpro">
                        Skip
                    </span>
                </Link>

                {/* Main Content Wrapper */}
                <div className="w-full max-w-[401px] flex flex-col items-center gap-[48px]">
                    
                    {/* Text & Progress Group */}
                    <div className="flex flex-col items-center gap-[40px] w-full">
                        
                        {/* Progress Indicators */}
                        <div className="flex flex-row items-center gap-[19px]">
                            {/* Inactive Bar */}
                            <div className="w-[80px] h-[4px] bg-[#D9D9D9] rounded-full" />
                            {/* Active Bar (Center) */}
                            <div className="w-[80px] h-[4px] bg-[#73BF44] rounded-full" />
                            {/* Inactive Bar */}
                            <div className="w-[80px] h-[4px] bg-[#D9D9D9] rounded-full" />
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col items-center gap-[16px]">
                            <h1 className="text-[32px] leading-[40px] font-semibold text-black text-center">
                                Create together without the usual risks
                            </h1>
                            <p className="text-[18px] leading-[28px] font-medium text-[#434C4F] text-center">
                                Work with others seamlessly while keeping your contributions protected and your payments secure, all in one place.
                            </p>
                        </div>

                    </div>

                    {/* Continue Button */}
                    <Link href="/intro/step-3">
                        <button className="flex flex-row items-center justify-center px-[28px] py-[14px] gap-[10px] bg-[#73BF44] hover:bg-[#62a538] transition-colors rounded-[50px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] group">
                            <span className="text-[18px] leading-[21px] font-bold text-white">
                                Continue
                            </span>
                            {/* Circular Arrow Icon Container */}
                            <div className="w-[28px] h-[28px] bg-white rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                <HiArrowRight className="w-4 h-4 text-[#73BF44]" />
                            </div>
                        </button>
                    </Link>

                </div>
            </div>

            {/* Illustration Mask */}
            <div className="hidden lg:block flex-1 relative overflow-hidden my-0">
                
                {/* Graphic Image */}
                <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-left animate-in fade-in duration-700"
                    style={{ 
                        backgroundImage: "url('/Mask II.png')", 
                    }}
                />
            </div>

        </main>
    );
}