import React from 'react';
import Link from 'next/link';
import { HiOutlineArrowLeft } from "react-icons/hi";
import { HugeiconsIcon } from '@hugeicons/react';
import { MailOpenIcon } from '@hugeicons/core-free-icons';


export default function VerifyEmailPage() {
    return (
        /* Inner Wrapper */
        <div className="w-full max-w-[517px] flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            
            <div className="w-[124px] h-[124px] mb-8 bg-white/50 border border-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
          <HugeiconsIcon icon={MailOpenIcon} className="w-[60px] h-[60px] text-white" strokeWidth={0.5} />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full mb-8">
                <Link 
                    href="/auth/signup" 
                    className="w-10 h-10 border-[1.5px] border-white rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors shrink-0"
                >
                    <HiOutlineArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl md:text-[32px] leading-[40px] font-semibold text-white text-center md:text-left font-raleway">
                    Please Verify Your Email
                </h1>
            </div>

            <p className="text-[16px] md:text-[18px] leading-[1.4] md:leading-[21px] font-normal text-white text-center mb-16 font-raleway">
                You're almost there! We've sent a verification link to <span className="font-bold">th****@outlook.com</span><br /><br />
                Just click on the link in that mail to confirm your account and start collaborating on CollabDen. 
        </p>
        
        <p className="text-[16px] md:text-[18px] leading-[1.4] md:leading-[21px] font-normal text-white text-center mb-16 font-raleway">
          Didn't see the mail? Check your <span className="font-bold">spam</span> or <span className="font-bold">promotions</span> folder
        </p>

            <button 
                type="button"
                className="w-full flex justify-center items-center py-4 px-6 bg-[#73BF44] hover:bg-[#62a538] transition-colors rounded-[24px] text-white text-[18px] leading-[20px] font-semibold font-raleway"
            >
                Resend Verification Email
            </button>
            
        </div>
    );
}