"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BsArrowUpRightCircleFill } from "react-icons/bs";

const Hotspot = ({ x, y, label, position = "top" }: { x: string, y: string, label: string, position?: "top" | "bottom" | "left" | "right" }) => (
    <div
        className="absolute z-30 flex flex-col items-center group cursor-pointer"
        style={{ left: x, top: y }}
    >
        <div className="relative">
            <div className="w-4 h-4 md:w-5 md:h-5 bg-primary-green rounded-full shadow-[0_0_20px_rgba(31,253,5,0.9)] animate-pulse" />
            <div className="absolute inset-0 w-4 h-4 md:w-5 md:h-5 bg-primary-green/20 rounded-full scale-[2.5] animate-ping" />
        </div>
        <div className={`absolute ${position === "top" ? "bottom-7 left-1/2 -translate-x-1/2" :
            position === "bottom" ? "top-7 left-1/2 -translate-x-1/2" :
                position === "left" ? "right-7 top-1/2 -translate-y-1/2" :
                    "left-7 top-1/2 -translate-y-1/2"
            } whitespace-nowrap text-white/90 text-[9px] md:text-[11px] font-medium leading-tight pointer-events-none text-center drop-shadow-lg`}>
            {label.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                    {word} {i === 1 && label.split(' ').length > 3 ? <br /> : null}
                </React.Fragment>
            ))}
        </div>
    </div>
);

const AboutHero = () => {
    return (
        <section className="relative w-full min-h-screen flex flex-col overflow-hidden pt-28 md:pt-32">
            {/* COLLABDEN Header Area */}
            <div className="w-full shrink-0 select-none pointer-events-none z-0 flex justify-center px-4 bg-linear-[45deg] from-black/10 from-25% via-blue-800/50 via-65% to-black/10 to-75%">
                <h1 className="w-full max-w-6xl h-auto md:h-50 font-bold text-center uppercase tracking-tighter leading-none mb-0">
                    <span className="text-[12vw] md:text-[190.476px] md:leading-50 bg-linear-to-b from-white from-[24.89%] to-[#122E5A]/21 to-[60.82%] bg-clip-text text-transparent">
                        COLLABDEN
                    </span>
                </h1>
            </div>

            {/* Main Content Area - Card and Tagline */}
            <div className="relative flex-1 -mt-5 md:-mt-13 w-full z-10 flex flex-col px-6 md:px-10 lg:px-20 pb-10 md:pb-20 max-w-7xl mx-auto">
                
                {/* --- The Ambient Blue Glow --- */}
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[70%] h-[60%] bg-black opacity-80 blur-[120px] rounded-full pointer-events-none z-0" />

                {/* --- Sub-content Area--- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="relative z-10 w-full min-h-125 lg:min-h-140 lg:max-h-full md:min-h-0 md:aspect-video border border-primary-green/25 rounded-[30px] md:rounded-[40px] shadow-[0_0_80px_rgba(18,46,90,0.6)] overflow-hidden mb-8 md:mb-12"
                >
                    {/* Background Image */}
                    <div 
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: "url('/about-hero.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    
                    {/* Light gradient for image */}
                    <div className="absolute inset-0 z-0 bg-linear-to-r from-[#02050A] via-blue-900/50 to-[#02050A] pointer-events-none" />

                    {/* Hotspots positioned relative to the card now*/}
                    <Hotspot
                        x="31%"
                        y="15%"
                        label="High quality audio file sharing"
                        position="top"
                    />
                    <Hotspot
                        x="48%"
                        y="44%"
                        label="Task & project management"
                        position="bottom"
                    />
                    <Hotspot
                        x="15%"
                        y="65%"
                        label="Secure Payments"
                        position="top"
            />
            
            {/* Tagline */}
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 lg:bottom-12 lg:left-12 z-20 max-w-[80%] md:max-w-[50%] lg:max-w-[45%] pointer-events-none">
                                    <h2 className="text-xl md:text-2xl lg:text-4xl font-semibold text-white tracking-tight leading-[1.1] drop-shadow-xl">
                                        Unifying music collaboration for creators In Africa
                                    </h2>
                                </div>

                    {/* --- About Us Card --- */}
                    <div className="absolute top-6 right-6 md:top-1/2 md:-translate-y-1/2 md:right-8 lg:max-h-137 rounded-2xl lg:right-10 z-20 w-[calc(100%-3rem)] sm:w-[320px] lg:w-95 bg-[#050B15]/80 backdrop-blur-xl border border-white/20 rounded-3x1 p-5 md:p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                        {/* Title Section */}
                                                <div className="flex justify-between items-center w-full gap-5 mb-5">
                                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mx-auto">About Us</h3>
                                                    <span className="bg-white rounded-full flex max-w-fit max-h-fit min-w-fit min-h-fit  items-center justify-center group hover:bg-primary-green transition-colors duration-300 shrink-0">
                                                        <BsArrowUpRightCircleFill className="w-6 h-16 md:w-8 md:h-8 lg:w-10 lg:h-10 text-primary-green transition-transform duration-300" />
                                                    </span>
                                                </div>
                        
                                                {/* Content Section - Underneath, with scrollable text */}
                                                <div className="space-y-3 md:space-y4  text-gray-300 text-xs md:text-sm lg:text-lg leading-relaxed pr-2 max-h-80 md:max-h-90 overflow-y-auto no-scrollbar">
                                                    <p>
                                                        CollabDen was created to solve the challenges musicians face when collaborating remotely.
                                                        Producers, vocalists, songwriters, and sound engineers often rely on scattered tools to
                                                        manage projects, share files, and communicate. CollabDen brings these essential tools
                                                        into one centralized workspace designed for music creators.
                                                    </p>
                                                    <p>
                                                        CollabDen provides a centralized platform designed specifically for music creators.
                                                        It brings communication, high-quality file sharing, task management, legal agreements,
                                                        and secure payments into one professional workspace. By unifying these essential tools,
                                                        CollabDen enables creators to collaborate efficiently, protect their work, and connect
                                                        with trusted talent beyond their existing networks.
                                                    </p>
                                                </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutHero;