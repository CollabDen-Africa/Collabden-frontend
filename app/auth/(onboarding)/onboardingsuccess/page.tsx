import React from 'react';
import Link from 'next/link';
import { HiCheckCircle } from "react-icons/hi";


export default function SuccessPage() {
    return (
        /* Inner Wrapper */
        <div className="w-full max-w-[517px] flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            
          <div className="w-[124px] h-[124px] mb-8 bg-white/80 border border-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
                          <HiCheckCircle className="w-[100px] h-[100px] text-[#73BF44]" />
                      </div>
          
                      {/* Title */}
                      <h1 className="text-2xl md:text-[32px] leading-[40px] font-semibold text-white text-center mb-8 font-raleway">
                          Welcome to CollabDen
                      </h1>
          
                      {/* Body Text */}
                      <p className="text-[16px] md:text-[18px] leading-[1.4] md:leading-[21px] font-normal text-white text-center mb-16 font-raleway">
                          You’re all set! Let’s get your profile ready so you can start collaborating
                      </p>
          
                      {/* Primary Button */}
                      <Link href="/dashboard/setup" className="w-full">
                          <button 
                              type="button"
                              className="w-full flex justify-center items-center py-[16px] px-[24px] bg-[#73BF44] hover:bg-[#62a538] transition-colors rounded-[24px] text-[#F8F8F8] text-[18px] leading-[20px] font-normal font-raleway shadow-lg"
                          >
                              Set up profile
                          </button>
                      </Link>
                      
                  </div>
              );
          }