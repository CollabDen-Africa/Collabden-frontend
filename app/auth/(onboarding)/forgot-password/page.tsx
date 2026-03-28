"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { HiOutlineArrowLeft } from "react-icons/hi";
import { HugeiconsIcon } from '@hugeicons/react';
import { SquareUnlock02Icon } from '@hugeicons/core-free-icons';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Password reset requested for:", email);
    };

    return (
        <div className="w-full max-w-[517px] flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            
            {/* Main Wrapper */}
            <div className="w-full flex flex-col gap-[48px]">

                {/* Top Section */}
                <div className="flex flex-col items-center gap-[32px] w-full">
                    
                    {/* Key Icon */}
                    <div className="w-[124px] h-[124px] bg-white/50 border border-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
              <HugeiconsIcon icon={SquareUnlock02Icon} className="w-[60px] h-[60px] text-white" strokeWidth={0.5} />
                    </div>

                    {/* Title Row */}
                    <div className="flex flex-row items-center gap-[32px] w-full md:pr-[40px] justify-center">
                        <Link 
                            href="/auth/login" 
                            className="w-[40px] h-[40px] border-[1.5px] border-white rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors shrink-0"
                        >
                            <HiOutlineArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-[32px] leading-[40px] font-semibold text-white font-raleway">
                            Forgot password?
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <p className="text-[18px] leading-[21px] font-normal text-white text-center font-raleway px-2">
                        Enter your email and we'll send you a link <br /> to reset your password
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[48px]">
                    
                    {/* Input Group */}
                    <div className="flex flex-col gap-[8px] w-full">
                        <label htmlFor="email" className="text-[18px] leading-[22px] font-semibold text-white font-raleway pl-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            placeholder="Johndoe@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[52px] px-[16px] bg-transparent border border-white rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/10 transition-all font-raleway text-[16px] font-medium"
                        />
                    </div>

                    {/* Primary Button */}
                    <button 
                        type="submit"
                        className="w-full h-[52px] flex justify-center items-center px-[24px] bg-[#73BF44] hover:bg-[#62a538] transition-colors rounded-[24px] text-[#F8F8F8] text-[18px] leading-[20px] font-semibold font-raleway shadow-lg"
                    >
                      Continue
                    </button>
                </form>

            </div>
        </div>
    );
}