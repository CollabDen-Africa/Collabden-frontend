"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { HiOutlineArrowLeft } from "react-icons/hi";
import { HugeiconsIcon } from '@hugeicons/react';
import { SquareUnlock02Icon } from '@hugeicons/core-free-icons';
import authService from '@/services/auth.service';
import { ROUTES } from '@/constants/routes';

function PasswordResetForm() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResend = async () => {
        if (!email) return;

        try {
            setIsLoading(true);
            setError('');
            setMessage('');
            await authService.forgotPassword(email);
            setMessage("A new reset link has been sent to your email.");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Failed to resend link. Please try again.");
            } else {
                setError("Failed to resend link. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        /* Inner Wrapper */
        <div className="w-full max-w-[517px] flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            
            <div className="w-[124px] h-[124px] mb-8 bg-white/50 border border-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
          <HugeiconsIcon icon={SquareUnlock02Icon} className="w-[60px] h-[60px] text-white" strokeWidth={0.5} />
            </div>

            {/* Title Row */}
            <div className="flex flex-row items-center gap-[32px] w-full md:pr-[40px] justify-center mb-8">
                <Link 
                    href={ROUTES.AUTH.FORGOT_PASSWORD} 
                    className="w-[40px] h-[40px] border-[1.5px] border-white rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors shrink-0"
                >
                    <HiOutlineArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-[32px] leading-[40px] font-semibold text-white font-raleway">
                    Reset Link Sent
                </h1>
            </div>

            <p className="text-[16px] md:text-[18px] leading-[1.4] md:leading-[21px] font-normal text-white text-center mb-10 font-raleway">
                We&apos;ve sent a password reset link to <span className="font-bold">{email || "your email"}. </span><br /><br />
                Open it to create a new password. 
            </p>
            
            {message && (
                <div className="w-full bg-green-500/20 border border-green-500/50 text-white px-4 py-3 rounded-xl text-sm font-medium text-center mb-6">
                    {message}
                </div>
            )}

            {error && (
                <div className="w-full bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl text-sm font-medium text-center mb-6">
                    {error}
                </div>
            )}
        
            <p className="text-[16px] md:text-[18px] leading-[1.4] md:leading-[21px] font-normal text-white text-center mb-12 font-raleway opacity-80">
                Didn&apos;t see the mail? Check your <span className="font-bold">spam</span> folder
            </p>

            <button 
                type="button"
                onClick={handleResend}
                disabled={isLoading || !email}
                className="w-full flex justify-center items-center py-4 px-6 bg-[#73BF44] hover:bg-[#62a538] transition-colors rounded-[24px] text-white text-[18px] leading-[20px] font-semibold font-raleway disabled:opacity-50"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    "Resend Link"
                )}
            </button>
            
        </div>
    );
}

export default function PasswordResetPage() {
    return (
        <Suspense fallback={
            <div className="w-full flex justify-center items-center py-10">
                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        }>
            <PasswordResetForm />
        </Suspense>
    );
}