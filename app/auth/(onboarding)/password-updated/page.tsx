import React from "react";
import Link from "next/link";
import { HiCheckCircle } from "react-icons/hi";

export default function PasswordUpdatedPage() {
  return (
    <div className="w-full max-w-[517px] flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
      {/* Main Wrapper */}
      <div className="w-full flex flex-col gap-[48px]">
        {/* Top Section (Icon, Title, Subtitle) */}
        <div className="flex flex-col items-center gap-[32px] w-full">
          {/* Success Icon Container */}
          <div className="w-[124px] h-[124px] bg-white/80 border border-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
            <HiCheckCircle className="w-[100px] h-[100px] text-[#73BF44]" />
          </div>

          {/* Text Group */}
          <div className="flex flex-col items-center gap-[32px] w-full">
            {/* Title */}
            <h1 className="text-[32px] leading-[40px] font-semibold text-white text-center font-raleway">
              Password Updated
            </h1>

            {/* Subtitle */}
            <p className="text-[18px] leading-[21px] font-normal text-white text-center font-raleway px-2">
              You’re all set! You can now login and continue <br />
              your work on CollabDen.
            </p>
          </div>
        </div>

        {/* Primary Button */}
        <Link href="/auth/login" className="w-full">
          <button
            type="button"
            className="w-full h-[52px] flex justify-center items-center px-[24px] bg-[#73BF44] hover:bg-[#62a538] transition-colors rounded-[24px] text-[#F8F8F8] text-[18px] leading-[20px] font-semibold font-raleway shadow-lg"
          >
            Go to Login
          </button>
        </Link>
      </div>
    </div>
  );
}
