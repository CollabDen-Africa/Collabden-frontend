"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BsArrowRight } from "react-icons/bs";

const Hotspot = ({ x, y, label, position = "top" }: { x: string, y: string, label: string, position?: "top" | "bottom" | "left" | "right" }) => (
    <div
        className="absolute z-30 flex flex-col items-center group"
        style={{ left: x, top: y }}
    >
        <div className="relative">
            <div className="w-5 h-5 bg-primary-green rounded-full shadow-[0_0_15px_rgba(31,253,5,0.8)] animate-pulse" />
            <div className="absolute inset-0 w-5 h-5 bg-primary-green/20 rounded-full scale-[2.5] animate-ping" />
        </div>
        <div className={`absolute ${position === "top" ? "bottom-8" : "top-8"} whitespace-nowrap bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}>
            <span className="text-white text-[10px] md:text-xs font-medium">{label}</span>
        </div>
        <div className={`mt-2 text-center max-w-[120px] pointer-events-none hidden md:block`}>
            <span className="text-white/80 text-[10px] md:text-[11px] font-medium leading-tight shadow-sm drop-shadow-md">
                {label}
            </span>
        </div>
    </div>
);

const AboutHero = () => {
    return (
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
            {/* Background Large Text */}
            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-full select-none pointer-events-none z-0">
                <h1 className="text-[12vw] md:text-[15vw] font-black text-center leading-none tracking-tighter uppercase mb-0">
                    <span className="bg-linear-to-b from-white/10 to-transparent bg-clip-text text-transparent">
                        COLLABDEN
                    </span>
                </h1>
            </div>

            {/* Visual Content Container */}
            <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">

                {/* Left Side: Studio Image with Hotspots */}
                <div className="relative w-full lg:w-[60%] aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                    <Image
                        src="/about-hero.png"
                        alt="CollabDen Studio"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Hotspots based on reference image */}
                    <Hotspot x="30%" y="15%" label="High quality audio file sharing" />
                    <Hotspot x="48%" y="55%" label="Task & project management" position="bottom" />
                    <Hotspot x="15%" y="65%" label="Secure Payments" position="bottom" />
                </div>

                {/* Right Side: Floating Info Card */}
                <div className="relative w-full lg:w-[35%] flex flex-col gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-[#0B0D0E]/80 backdrop-blur-xl rounded-[2rem] border-2 border-primary-green p-8 md:p-10 shadow-2xl relative overflow-hidden group"
                    >
                        {/* Card Glow */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-green/10 blur-[60px] rounded-full group-hover:scale-125 transition-transform duration-1000" />

                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">About Us</h2>
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg shadow-white/10 hover:scale-110 transition-transform cursor-pointer">
                                <BsArrowRight className="text-primary-green" size={24} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <p className="text-white/60 text-sm md:text-base leading-relaxed">
                                CollabDen was created to solve the challenges musicians face when collaborating remotely. Producers, vocalists, songwriters, and sound engineers often rely on scattered tools to manage projects, share files, and communicate. CollabDen brings these essential tools into one centralized workspace designed for music creators.
                            </p>
                            <p className="text-white/60 text-sm md:text-base leading-relaxed">
                                CollabDen provides a centralized platform designed specifically for music creators. It brings communication, high-quality file sharing, task management, legal agreements, and secure payments into one professional workspace. By unifying these essential tools, CollabDen enables creators to collaborate efficiently, protect their work, and connect with trusted talent beyond their existing networks.
                            </p>
                        </div>

                        {/* Stats Pill */}
                        <div className="mt-10 flex items-center bg-[#204F99]/90 backdrop-blur-md rounded-lg p-1.5 w-max">
                            <div className="flex items-center gap-3 px-3">
                                <span className="text-white text-md font-bold">441</span>
                                <div className="w-[1px] h-4 bg-white/30" />
                                <div className="flex items-center gap-1.5">
                                    <Image src="/collabden-logo.png" alt="Logo" width={16} height={16} className="h-4 w-auto brightness-0 invert" />
                                    <span className="text-white text-md font-bold">438 Hug</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Headline */}
            <div className="container mx-auto px-6 mt-16 md:mt-24 text-left z-20">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl md:text-6xl font-black text-white max-w-4xl tracking-tight leading-[1.1]"
                >
                    Unifying music collaboration for creators In Africa
                </motion.h2>
            </div>
        </section>
    );
};

export default AboutHero;
