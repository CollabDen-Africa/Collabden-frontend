import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiArrowRight } from "react-icons/hi";

export default function IntroSlideTwoPage() {
    return (
        <main className="relative min-h-screen w-full flex bg-white overflow-hidden font-raleway">
            
            {/* Left Column (Content) */}
            <div className="w-full lg:w-[520px] relative flex flex-col justify-center items-center px-6 py-20 shrink-0 border-r border-gray-100 z-10">
                
                {/* Skip Button */}
                <Link 
                    href="/dashboard" 
                    className="absolute top-8 left-8 md:top-[63px] md:left-[41px] flex justify-center items-center px-[15px] py-[4px] border border-dashed border-[#878A8B] rounded-[50px] hover:bg-gray-50 transition-colors"
                >
                    <span className="text-[16px] leading-[22px] text-[#878A8B] font-sfpro">
                        Skip
                    </span>
                </Link>

                {/* Main Content Wrapper */}
                <div className="w-full max-w-[401px] flex flex-col items-center gap-[48px]">
                    
                    {/* Text & Progress Group */}
                    <div className="flex flex-col items-center gap-[40px] w-full pt-88">
                        
                        {/* Progress Indicators */}
                        <div className="flex flex-row items-center gap-[19px]">
                            <div className="w-[80px] h-[4px] bg-[#D9D9D9] rounded-full" />
                            {/* Active Bar (Center) */}
                            <div className="w-[80px] h-[4px] bg-primary-green rounded-full" />
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
                        <button className="flex flex-row items-center justify-center px-[28px] py-[14px] gap-[10px] bg-primary-green hover:bg-[#62a538] transition-colors rounded-[50px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] group">
                            <span className="text-[18px] leading-[21px] font-bold text-white">
                                Continue
                            </span>
                            <div className="w-[28px] h-[28px] bg-white rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                <HiArrowRight className="w-4 h-4 text-primary-green" />
                            </div>
                        </button>
                    </Link>

                </div>
            </div>

            {/* Right Column (Illustration) */}
            <div className="hidden lg:block flex-1 relative overflow-hidden my-0">
                
                {/* Image */}
                <Image 
                    src="/Mask II.png"
                    alt="CollabDen secure collaboration"
                    fill
                    priority
                    className="object-cover animate-in fade-in duration-700"
                />
            </div>

        </main>
    );
}