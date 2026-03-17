"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BsArrowUpRightCircleFill } from "react-icons/bs";

// const Hotspot = ({ x, y, label, position = "top" }: { x: string, y: string, label: string, position?: "top" | "bottom" | "left" | "right" }) => (
//     <div
//         className="absolute z-30 flex flex-col items-center group"
//         style={{ left: x, top: y }}
//     >
//         <div className="relative">
//             <div className="w-4 h-4 md:w-5 md:h-5 bg-primary-green rounded-full shadow-[0_0_20px_rgba(31,253,5,0.9)] animate-pulse" />
//             <div className="absolute inset-0 w-4 h-4 md:w-5 md:h-5 bg-primary-green/20 rounded-full scale-[2.5] animate-ping" />
//         </div>
//         <div className={`absolute ${position === "top" ? "bottom-7 left-1/2 -translate-x-1/2" :
//             position === "bottom" ? "top-7 left-1/2 -translate-x-1/2" :
//                 position === "left" ? "right-7 top-1/2 -translate-y-1/2" :
//                     "left-7 top-1/2 -translate-y-1/2"
//             } whitespace-nowrap text-white/90 text-[9px] md:text-[11px] font-medium leading-tight pointer-events-none text-center drop-shadow-lg`}>
//             {label.split(' ').map((word, i) => (
//                 <React.Fragment key={i}>
//                     {word} {i === 1 && label.split(' ').length > 3 ? <br /> : null}
//                 </React.Fragment>
//             ))}
//         </div>
//     </div>
// );

const AboutHero = () => {
    return (
        <section className="relative w-full min-h-screen flex flex-col overflow-hidden pt-28 md:pt-32">
            {/* COLLABDEN Header Area */}
            <div className="w-full shrink-0 select-none pointer-events-none z-0 flex justify-center px-4">
                <h1 className="w-full max-w-6xl h-auto md:h-50 font-bold text-center uppercase tracking-tighter leading-none mb-0">
                    <span className="text-[12vw] md:text-[190.476px] md:leading-50 bg-linear-to-b from-white from-[24.89%] to-[#122E5A]/21 to-[60.82%] bg-clip-text text-transparent">
                        COLLABDEN
                    </span>
                </h1>
            </div>

            {/* Main Content Area - Card and Tagline */}
            <div className="relative flex-1 -mt-5 md:-mt-13 w-full z-10 flex flex-col px-6 md:px-10 lg:px-20 pb-10 md:pb-20 max-w-7xl mx-auto">
                {/* About Us Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="relative w-full h-fit bg-[#050B15]/80 backdrop-blur-3xl border border-primary-green/20 rounded-[40px] p-8 md:p-12 lg:p-16 shadow-[0_0_80px_rgba(0,0,0,0.6)] mb-10 md:mb-16"
                >
                    {/* Hotspots positioned relative to the card now */}
                    {/* <Hotspot
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
                    /> */}

                    <div className="relative w-fit flex flex-col gap-6 md:gap-10">
                        {/* Title Section */}
                        <div className="flex justify-between items-center w-full">
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">About Us</h3>
                            <span className="bg-white rounded-full flex items-center justify-center group hover:bg-primary-green transition-colors duration-300 shrink-0">
                                <BsArrowUpRightCircleFill className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-primary-green transition-transform duration-300" />
                            </span>
                        </div>

                        {/* Content Section - Underneath, with scrollable text */}
                        <div className="space-y-6 text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed pr-4">
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

                {/* Left Side: Tagline - Now outside and at the bottom */}
                <div className="max-w-2xl w-full">
                    <h2 className="text-xl md:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-[1.2]">
                        Unifying music collaboration for creators In Africa
                    </h2>
                </div>
            </div>
        </section>
    );
};

export default AboutHero;
