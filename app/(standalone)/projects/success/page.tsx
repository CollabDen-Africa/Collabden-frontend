"use client";

import React from "react";
import Link from "next/link";

export default function ProjectSuccessPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center pb-20 pt-4 px-4 sm:px-6 lg:px-8">
      
      {/* Main Container */}
      <div className="w-full max-w-[1008px] h-auto md:h-[858px] bg-foreground/20 backdrop-blur-md border-2 border-foreground rounded-[30px] md:rounded-[50px] p-6 sm:p-10 flex items-center justify-center shadow-2xl relative z-10">
        <div className="w-full max-w-[517px] flex flex-col items-center text-center gap-[48px]">
          
          {/* Top Section: Icon + Text */}
          <div className="flex flex-col items-center gap-[32px] w-full">
            
            {/* Success Icon Outer Circle */}
            <div className="w-[124px] h-[124px] bg-foreground/80 border border-foreground rounded-full flex items-center justify-center shrink-0 shadow-lg">
              <svg 
                width="80" 
                height="80" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary-green"
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM16.7744 9.63255C17.1511 9.22744 17.1283 8.59336 16.7231 8.21666C16.318 7.83996 15.684 7.86278 15.3073 8.26789L10.6133 13.3134L8.64998 11.2185C8.25878 10.7961 7.62534 10.7634 7.20299 11.1546C6.78065 11.5458 6.74792 12.1793 7.13912 12.6016L9.85172 15.5298C10.0416 15.7339 10.306 15.8522 10.5843 15.8569C10.8626 15.8617 11.1311 15.7523 11.3283 15.5404L16.7744 9.63255Z" 
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="flex flex-col items-center gap-[16px] md:gap-[32px] w-full">
              <h1 className="font-sans font-semibold text-[26px] md:text-[32px] leading-tight text-foreground">
                Project created successfully!
              </h1>
              <p className="font-sans font-medium text-[16px] md:text-[18px] leading-tight text-foreground">
                Your workspace is ready
              </p>
            </div>

          </div>

          {/* Primary Action Button */}
          <Link 
            href="/dashboard" 
            className="w-full flex items-center justify-center h-[52px] bg-primary-green rounded-[24px] font-sans font-semibold text-[18px] text-[#F8F8F8] shadow-btn-primary hover:shadow-btn-hover hover:brightness-110 transition-all active:scale-[0.98]"
          >
            Go to Workspace
          </Link>

        </div>
      </div>
    </div>
  );
}