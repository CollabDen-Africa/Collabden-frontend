"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { HiOutlineArrowLeft } from "react-icons/hi";
import { HugeiconsIcon } from '@hugeicons/react';
import { MailOpenIcon } from '@hugeicons/core-free-icons';
import { useVerifyEmail, useResendVerification } from '@/hooks/auth/useVerifyEmail';
import { ROUTES } from '@/constants/routes';

function VerifyEmailForm() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const verifyMutation = useVerifyEmail();
    const resendMutation = useResendVerification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code || code.length < 4) {
            setError("Please enter a valid verification code.");
            return;
        }

        try {
            setError('');
            await verifyMutation.mutateAsync({ email, verificationToken: code });
            router.push(ROUTES.AUTH.ONBOARDING_SUCCESS);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Verification failed. Please check the code.");
        }
    };

    const handleResend = async () => {
        if (!email) {
            setError("Email is missing. Please try signing up again.");
            return;
        }

        try {
            setError('');
            setMessage('');
            await resendMutation.mutateAsync(email);
            setMessage("Verification code sent back to your email.");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to resend code.");
        }
    };

    const isLoading = verifyMutation.isPending;
    const resending = resendMutation.isPending;

    return (
        <div className="w-full max-w-[517px] flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            
            <div className="w-[124px] h-[124px] mb-8 bg-white/50 border border-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
          <HugeiconsIcon icon={MailOpenIcon} className="w-[60px] h-[60px] text-white" strokeWidth={0.5} />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full mb-8">
                <Link 
                    href={ROUTES.AUTH.SIGNUP} 
                    className="w-10 h-10 border-[1.5px] border-white rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors shrink-0"
                >
                    <HiOutlineArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl md:text-[32px] leading-[40px] font-semibold text-white text-center md:text-left font-raleway">
                    Please Verify Your Email
                </h1>
            </div>

            <p className="text-[16px] md:text-[18px] leading-[1.4] md:leading-[21px] font-normal text-white text-center mb-8 font-raleway">
                You&apos;re almost there! We&apos;ve sent a verification code to <span className="font-bold">{email || "your email"}</span><br /><br />
                Enter the code below to confirm your account.
            </p>

            {error && (
                <div className="w-full bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl text-sm font-medium text-center mb-6">
                    {error}
                </div>
            )}

            {message && (
                <div className="w-full bg-green-500/20 border border-green-500/50 text-white px-4 py-3 rounded-xl text-sm font-medium text-center mb-6">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 mb-8">
                <input
                    type="text"
                    required
                    disabled={isLoading}
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    className="w-full h-[52px] px-[16px] bg-transparent border border-white rounded-full text-white text-center text-2xl tracking-widest placeholder:text-white/30 placeholder:text-base placeholder:tracking-normal focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/10 transition-all font-raleway disabled:opacity-50"
                />

                <button 
                    type="submit"
                    disabled={isLoading || code.length < 4}
                    className="w-full flex justify-center items-center py-4 px-6 bg-[#73BF44] hover:bg-[#62a538] transition-colors rounded-[24px] text-white text-[18px] leading-[20px] font-semibold font-raleway disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        "Verify Email"
                    )}
                </button>
            </form>
            
            <p className="text-[16px] text-white/70 mb-4 font-raleway">
                Didn&apos;t see the mail? Check your <span className="font-bold">spam</span> folder
            </p>

            <button 
                type="button"
                onClick={handleResend}
                disabled={resending || isLoading}
                className="text-white font-bold hover:underline font-raleway disabled:opacity-50"
            >
                {resending ? "Resending..." : "Resend Verification Code"}
            </button>
            
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="w-full flex justify-center items-center py-10">
                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        }>
            <VerifyEmailForm />
        </Suspense>
    );
}