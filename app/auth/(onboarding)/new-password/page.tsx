"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { HugeiconsIcon } from '@hugeicons/react';
import { SquareLock02Icon } from '@hugeicons/core-free-icons';
import { useResetPassword } from '@/hooks/auth/useResetPassword';
import { ROUTES } from '@/constants/routes';
import { getErrorMessage } from '@/lib/error-handler';

function NewPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const resetPasswordMutation = useResetPassword();

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

        if (!/[A-Z]/.test(password)) {
            setError("Password must contain at least one uppercase letter.");
            return;
        }
        
        if (!/\d/.test(password)) {
            setError("Password must contain at least one number.");
            return;
        }

        try {
            await resetPasswordMutation.mutateAsync({ password, token });
            router.push(ROUTES.AUTH.PASSWORD_UPDATED);
        } catch (err) {
            console.error("Password reset failed:", err);
        }
    };

    return (
        <div className="w-full max-w-129.25 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            
            {/* Main Wrapper */}
            <div className="w-full flex flex-col gap-10">

                {/* Top Section + Form Inputs */}
                <div className="flex flex-col gap-6 w-full">
                    
                    {/* Headers */}
                    <div className="flex flex-col items-center gap-8 w-full">
                        {/* Lock Icon */}
                        <div className="w-31 h-31 bg-white/50 border border-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
                 <HugeiconsIcon icon={SquareLock02Icon} className="w-15 h-15 text-white" strokeWidth={0.5} />
                        </div>

                        {/* Title */}
                        <h1 className="text-[32px] leading-10 font-semibold text-white text-center font-raleway">
                            Create a new password
                        </h1>

                        {/* Subtitle */}
                        <p className="text-[18px] leading-5.25 font-normal text-white text-center font-raleway px-2 mb-2">
                            Choose a new password to secure your account <br /> and get back to work
                        </p>
                    </div>

                    {(error || resetPasswordMutation.error) && (
                        <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl text-sm font-medium text-center">
                            {error || getErrorMessage(resetPasswordMutation.error)}
                        </div>
                    )}

                    {/* Form Inputs */}
                    <form id="new-password-form" onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        
                        {/* New Password Group */}
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="password" className="text-[18px] leading-5.5 font-semibold text-white font-raleway pl-4">
                                    New Password
                                </label>
                                <div className="relative w-full">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        disabled={resetPasswordMutation.isPending || !token}
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-13 pl-5 pr-12.5 bg-transparent border border-white rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/10 transition-all font-raleway text-[16px] font-medium disabled:opacity-50"
                                    />
                                    {/* Toggle Visibility Button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/90 transition-colors"
                                    >
                                        {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            {/* Helper Text */}
                            <p className="text-[14px] leading-4.5 font-normal text-white/90 font-raleway pl-4 mt-3 mb-2">
                                At least 8 characters, include a number
                            </p>
                        </div>

                        {/* Confirm Password Group */}
                        <div className="flex flex-col gap-2 w-full">
                            <label htmlFor="confirmPassword" className="text-[18px] leading-5.5 font-semibold text-white font-raleway pl-4">
                                Confirm Password
                            </label>
                            <div className="relative w-full">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    disabled={resetPasswordMutation.isPending || !token}
                                    placeholder="Re-enter new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full h-13 pl-5 pr-12.5 bg-transparent border border-white rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/10 transition-all font-raleway text-[16px] font-medium disabled:opacity-50"
                                />
                                {/* Toggle Visibility Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/90 transition-colors"
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
                    disabled={resetPasswordMutation.isPending || !token || !password || password !== confirmPassword}
                    className="w-full h-13 flex justify-center items-center px-6 bg-primary-green hover:bg-primary-green transition-colors rounded-6 text-white text-[18px] leading-5 font-semibold font-raleway shadow-lg disabled:opacity-50"
                >
                    {resetPasswordMutation.isPending ? (
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