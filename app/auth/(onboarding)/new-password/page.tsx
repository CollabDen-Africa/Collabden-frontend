"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { HugeiconsIcon } from '@hugeicons/react';
import { SquareLock02Icon } from '@hugeicons/core-free-icons';
import authService from '@/services/auth.service';
import { ROUTES } from '@/constants/routes';

function NewPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing reset token.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        try {
            setIsLoading(true);
            await authService.resetPassword({ password, token });
            router.push(ROUTES.AUTH.PASSWORD_UPDATED);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Failed to update password. Link may have expired.");
            } else {
                setError("Failed to update password. Link may have expired.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[517px] flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            
            {/* Main Wrapper */}
            <div className="w-full flex flex-col gap-[40px]">

                {/* Top Section + Form Inputs */}
                <div className="flex flex-col gap-[24px] w-full">
                    
                    {/* Headers */}
                    <div className="flex flex-col items-center gap-[32px] w-full">
                        {/* Lock Icon */}
                        <div className="w-[124px] h-[124px] bg-white/50 border border-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
                 <HugeiconsIcon icon={SquareLock02Icon} className="w-[60px] h-[60px] text-white" strokeWidth={0.5} />
                        </div>

                        {/* Title */}
                        <h1 className="text-[32px] leading-[40px] font-semibold text-white text-center font-raleway">
                            Create a new password
                        </h1>

                        {/* Subtitle */}
                        <p className="text-[18px] leading-[21px] font-normal text-white text-center font-raleway px-2 mb-[8px]">
                            Choose a new password to secure your account <br /> and get back to work
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    {/* Form Inputs */}
                    <form id="new-password-form" onSubmit={handleSubmit} className="w-full flex flex-col gap-[16px]">
                        
                        {/* New Password Group */}
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col gap-[8px] w-full">
                                <label htmlFor="password" className="text-[18px] leading-[22px] font-semibold text-white font-raleway pl-4">
                                    New Password
                                </label>
                                <div className="relative w-full">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        disabled={isLoading || !token}
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-[52px] pl-[20px] pr-[50px] bg-transparent border border-white rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/10 transition-all font-raleway text-[16px] font-medium disabled:opacity-50"
                                    />
                                    {/* Toggle Visibility Button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-[20px] top-1/2 -translate-y-1/2 text-white/50 hover:text-white/90 transition-colors"
                                    >
                                        {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            {/* Helper Text */}
                            <p className="text-[14px] leading-[18px] font-normal text-white/90 font-raleway pl-4 mt-[12px] mb-[8px]">
                                At least 8 characters, include a number
                            </p>
                        </div>

                        {/* Confirm Password Group */}
                        <div className="flex flex-col gap-[8px] w-full">
                            <label htmlFor="confirmPassword" className="text-[18px] leading-[22px] font-semibold text-white font-raleway pl-4">
                                Confirm Password
                            </label>
                            <div className="relative w-full">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    disabled={isLoading || !token}
                                    placeholder="Re-enter new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full h-[52px] pl-[20px] pr-[50px] bg-transparent border border-white rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/10 transition-all font-raleway text-[16px] font-medium disabled:opacity-50"
                                />
                                {/* Toggle Visibility Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-[20px] top-1/2 -translate-y-1/2 text-white/50 hover:text-white/90 transition-colors"
                                >
                                    {showConfirmPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Primary Button */}
                <button 
                    type="submit"
                    form="new-password-form"
                    disabled={isLoading || !token || !password || password !== confirmPassword}
                    className="w-full h-[52px] flex justify-center items-center px-[24px] bg-[#73BF44] hover:bg-[#62a538] transition-colors rounded-[24px] text-[#F8F8F8] text-[18px] leading-[20px] font-semibold font-raleway shadow-lg disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        "Update Password"
                    )}
                </button>

            </div>
        </div>
    );
}

export default function NewPasswordPage() {
    return (
        <Suspense fallback={
            <div className="w-full flex justify-center items-center py-10">
                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        }>
            <NewPasswordForm />
        </Suspense>
    );
}