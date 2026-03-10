"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BsArrowUpRightCircleFill } from "react-icons/bs";

const Hotspot = ({ x, y, label, position = "top" }: { x: string, y: string, label: string, position?: "top" | "bottom" | "left" | "right" }) => (
    <div
        className="absolute z-30 flex flex-col items-center group"
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
        <section className="relative w-full h-screen flex flex-col overflow-hidden pt-28 md:pt-32">
            {/* COLLABDEN Header Area */}
            <div className="w-full shrink-0 select-none pointer-events-none z-0 flex justify-center">
                <h1 className="w-full max-w-6xl h-auto md:h-[200px] font-bold text-center uppercase tracking-tighter leading-none mb-0">
                    <span className="text-[12vw] md:text-[190.476px] md:leading-[200px] bg-linear-to-b from-white from-[24.89%] to-[#122E5A]/21 to-[60.82%] bg-clip-text text-transparent">
                        COLLABDEN
                    </span>
                </h1>
            </div>

            {/* Main Image Section - Fills exactly the remaining height with overlap */}
            <div className="relative flex-1 w-full z-10">
                <div className="relative w-full h-full overflow-hidden mt-[-5px] md:mt-[-40px] mix-blend-hard-light shadow-2xl">
                    <Image
                        src="/about-hero.png"
                        alt="CollabDen Studio"
                        fill
                        className="h-full w-full object-cover"
                        priority
                    />

                    {/* Hotspots repositioned based on reference image */}
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

                    {/* Content Overlay - Positioned at the bottom using justify-between */}
                    <div className="absolute inset-x-0 bottom-0 p-10 md:p-20 flex flex-col-reverse md:flex-row justify-between items-end gap-10 z-30">
                        {/* Left Side: Tagline */}
                        <div className="max-w-lg pb-4 md:pb-6">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-[1.1]">
                                Unifying music collaboration for creators In Africa
                            </h2>
                        </div>

                        {/* Right Side: About Us Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                            className="w-full md:w-[520px] bg-[#050B15]/80 backdrop-blur-3xl border border-primary-green/20 rounded-[40px] p-8 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.6)]"
                        >
                            <div className="relative">
                                <div className="flex justify-between items-start mb-8">
                                    <h3 className="text-2xl md:text-3xl font-bold  text-white">About Us</h3>
                                    <span className=" bg-white rounded-full flex items-center justify-center group hover:bg-primary-green transition-colors duration-300 shrink-0">
                                        <BsArrowUpRightCircleFill className="w-12 h-12 md:w-14 md:h-14 text-primary-green text-2xl transition-transform duration-300" />
                                    </span>
                                </div>

                                <div className="space-y-6 text-gray-300 text-sm md:text-xs lg:text-sm leading-relaxed">
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
                </div>
            </div>
        </section>
    );
};

export default AboutHero;
