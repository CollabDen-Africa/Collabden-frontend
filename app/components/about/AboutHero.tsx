"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import Image from 'next/image';

const Hotspot = ({ x, y, label, position = "top" }: { x: string, y: string, label: string, position?: "top" | "bottom" | "left" | "right" }) => (
    <div
        className="absolute z-30 hidden md:flex flex-col items-center group cursor-pointer"
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
        <section className="relative w-full flex flex-col overflow-hidden pt-28 md:pt-32">
            {/* COLLABDEN Header Area with blurred background */}
            <div className="w-full shrink-0 select-none pointer-events-none z-0 flex justify-center px-4 relative">
                {/* Blurred glow layer */}
                <div className="absolute inset-0 z-0 bg-linear-to-r from-transparent via-blue-800/40 to-transparent blur-[80px] opacity-70" />
                
                <h1 className="w-full max-w-6xl h-auto md:h-50 font-bold text-center uppercase tracking-tighter leading-none mb-0 relative z-10">
                    <span className="text-[12vw] md:text-[190.476px] md:leading-50 bg-linear-to-b from-white from-[24.89%] to-[#122E5A]/21 to-[60.82%] bg-clip-text text-transparent">
                        COLLABDEN
                    </span>
                </h1>
            </div>

            {/* Main Content Area - Card and Tagline */}
            <div className="relative flex-1 -mt-5 md:-mt-13 w-full z-10 flex flex-col px-6 md:px-10 lg:px-20 pb-4 md:pb-8 max-w-7xl mx-auto">
                
                {/* --- The Ambient Blue Glow --- */}
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[85%] h-[70%] bg-blue-900/40 opacity-60 blur-[150px] md:blur-[180px] rounded-full pointer-events-none z-0" />

                {/* --- Sub-content Area--- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="relative z-10 w-full min-h-125 lg:min-h-140 lg:max-h-full md:min-h-0 md:aspect-video  rounded-[30px] md:rounded-[40px] shadow-[0_0_80px_rgba(18,46,90,0.6)] overflow-hidden mb-8 md:mb-12"
                >
                    {/* Background Image */}
                    <Image 
                                            src="/about-hero.png"
                                            alt="CollabDen hero image"
                                            fill
                                            priority
                                            className="object-cover object-center z-0"
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
            <div className="hidden md:block absolute md:bottom-10 md:left-10 lg:bottom-12 lg:left-12 z-20 md:max-w-[50%] lg:max-w-[45%] pointer-events-none">
                                    <h2 className="text-xl md:text-2xl lg:text-4xl font-semibold text-white tracking-tight leading-[1.1] drop-shadow-xl">
                                        Unifying music collaboration for creators In Africa
                                    </h2>
                                </div>

                    {/* --- About Us Card --- */}
                    <div className="absolute top-6 right-6 md:top-1/2 md:-translate-y-1/2 md:right-8 lg:max-h-137 rounded-2xl lg:right-10 z-20 sm:w-[320px] lg:w-95 bg-[#050B15]/80 backdrop-blur-xl border border-white/20 rounded-3x1 p-5 md:p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                        {/* Title Section */}
                                                <div className="flex justify-between items-center w-full gap-5 mb-5">
                                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mx-auto">About Us</h3>
                                                    <span className="bg-white rounded-full flex w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8  items-center justify-center group hover:bg-primary-green transition-colors duration-300 shrink-0">
                                                        <BsArrowUpRightCircleFill className="w-full h-full text-primary-green transition-transform duration-300" />
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
          
          {/* --- Mobile Tagline (Hidden on bigger screens) --- */}
                          <motion.div 
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8, delay: 0.5 }}
                              className="md:hidden mt-8 w-full px-2 relative z-10"
                          >
                              <h2 className="text-2xl font-semibold text-white tracking-tight leading-[1.2]">
                                  Unifying music collaboration for <br /> creators In Africa
                              </h2>
                          </motion.div>
            </div>
        </section>
    );
};

export default AboutHero;