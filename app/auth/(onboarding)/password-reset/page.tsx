import React from 'react';
import Link from 'next/link';
import { HiOutlineArrowLeft } from "react-icons/hi";
import { HugeiconsIcon } from '@hugeicons/react';
import { SquareUnlock02Icon } from '@hugeicons/core-free-icons';


export default function VerifyEmailPage() {
    return (
        /* Inner Wrapper */
        <div className="w-full max-w-[517px] flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            
            <div className="w-[124px] h-[124px] mb-8 bg-white/50 border border-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
          <HugeiconsIcon icon={SquareUnlock02Icon} className="w-[60px] h-[60px] text-white" strokeWidth={0.5} />
            </div>

            {/* Title Row */}
            <div className="flex flex-row items-center gap-[32px] w-full md:pr-[40px] justify-center mb-8">
                <Link 
                    href="/auth/forgot-password" 
                    className="w-[40px] h-[40px] border-[1.5px] border-white rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors shrink-0"
                >
                    <HiOutlineArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-[32px] leading-[40px] font-semibold text-white font-raleway">
                    Password Reset
                </h1>
            </div>

            <p className="text-[16px] md:text-[18px] leading-[1.4] md:leading-[21px] font-normal text-white text-center mb-16 font-raleway">
                We've sent a reset link to <span className="font-bold">Johndoe@example.com. </span>
                Open it to create a new password 
        </p>
        
        <p className="text-[16px] md:text-[18px] leading-[1.4] md:leading-[21px] font-normal text-white text-center mb-16 font-raleway">
          Didn't see the mail? Check your <span className="font-bold">spam</span> or <span className="font-bold">promotions</span> folder
        </p>

            <button 
                type="button"
                className="w-full flex justify-center items-center py-4 px-6 bg-[#73BF44] hover:bg-[#62a538] transition-colors rounded-[24px] text-white text-[18px] leading-[20px] font-semibold font-raleway"
            >
                Resend Link
            </button>
            
        </div>
    );
}