"use client";

import React, { useState } from 'react';
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { HugeiconsIcon } from '@hugeicons/react';
import { SquareLock02Icon } from '@hugeicons/core-free-icons';


export default function NewPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            console.error("Passwords do not match!");
            return;
        }
        console.log("Setting new password...");
        // API logic here -> then router.push('/auth/password-updated')
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
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-[52px] pl-[20px] pr-[50px] bg-transparent border border-white rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/10 transition-all font-raleway text-[16px] font-medium"
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
                                    placeholder="Re-enter new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full h-[52px] pl-[20px] pr-[50px] bg-transparent border border-white rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/10 transition-all font-raleway text-[16px] font-medium"
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
                {/* Tied to the form using the 'form' attribute so it can sit outside the flex layout block */}
                <button 
                    type="submit"
                    form="new-password-form"
                    className="w-full h-[52px] flex justify-center items-center px-[24px] bg-[#73BF44] hover:bg-[#62a538] transition-colors rounded-[24px] text-[#F8F8F8] text-[18px] leading-[20px] font-semibold font-raleway shadow-lg"
                >
                    Update Password
                </button>

            </div>
        </div>
    );
}