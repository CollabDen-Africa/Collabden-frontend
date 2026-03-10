"use client";

import React from 'react';
import { motion } from 'framer-motion';

const PANORAMA_ANGLES = [30, 10, -10, -40];

const HowItWorks = () => {
    const [isDesktop, setIsDesktop] = React.useState(false);

    React.useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 1024);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const steps = [
        {
            title: "Create Your Profile",
            description: "Sign up and showcase your skills. Add your music, credentials, and collaboration interests",
            icon: 1,
        },
        {
            title: "Discover & Connect",
            description: "Browse the marketplace. Find collaborators and projects that match your style and goals.",
            icon: 2,
        },
        {
            title: "Collaborate",
            description: "Work together in real-time. Share files, chat, manage tasks, and track progress.",
            icon: 3,
        },
        {
            title: "Get Paid",
            description: "Escrow payment system according to signed agreements",
            icon: 4,
        },
    ];

    const profiles = [
        {
            title: "Producers",
            description: "Collaborate on beats, samples, and arrangements",
            icon: "🎧",
        },
        {
            title: "Vocalists",
            description: "Share recordings and get feedback instantly",
            icon: "🎤",
        },
        {
            title: "Engineers",
            description: "Mix and master with the whole team",
            icon: "🎚️",
        },
        {
            title: "Songwriters",
            description: "Co-write and manage publishing agreements",
            icon: "✍️",
        },
        {
            title: "Session Instrumentalists",
            description: "Perform on studio",
            icon: "🎸",
        },
    ];

    return (
        <section id="how-it-works" className="relative py-24 px-6 backdrop-blur-md overflow-hidden">
            <div className="container mx-auto max-w-6xl relative z-10">
                {/* How It Works Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        How It Works
                    </h2>
                    <p className="text-lg text-white">
                        Simple steps to start your next collaboration
                    </p>
                </motion.div>

                {/* Panorama cards */}
                <motion.div
                    className="flex flex-col lg:flex-row justify-center items-center gap-5 lg:gap-8 mb-32"
                    style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -50, rotateY: 0 }}
                            whileInView={{
                                opacity: 1,
                                x: 0,
                                rotateY: isDesktop ? PANORAMA_ANGLES[index] : 0
                            }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.15 }}
                            whileHover={{
                                scale: 1.05,
                                rotateY: 0,
                                z: 50,
                                transition: { duration: 0.3 }
                            }}
                            className="relative bg-white/20 border-2 border-primary-green rounded-[29px] px-6 py-10 w-full lg:w-[308px] flex flex-col justify-end shadow-xl cursor-default"
                            style={{
                                transformStyle: "preserve-3d",
                            }}
                        >
                            <div className="flex flex-col gap-8">
                                <h3 className="text-xl font-bold text-white">
                                    {step.title}
                                </h3>
                                <p className="text-md font-medium text-white leading-snug">
                                    {step.description}
                                </p>
                                <div className="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center text-white font-semibold text-2xl">
                                    {step.icon}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Built For Everyone Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Built For Everyone In <span className="text-primary-green">Music</span>
                    </h2>
                    <p className="text-lg text-white">
                        Built with musicians. Designed for professional collaboration.
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto flex flex-col">
                    {profiles.map((profile, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{
                                scale: 1.02,
                                x: 10,
                                transition: { duration: 0.2 }
                            }}
                            style={{
                                background: 'linear-gradient(180deg, #FFFFFF 0%, #B0B0B0 100%)',
                                zIndex: index,
                                marginTop: index === 0 ? 0 : '-12px',
                            }}
                            className="w-full flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-6 px-5 pt-4 pb-6 md:px-8 md:py-5 rounded-2xl shadow-lg cursor-default relative"
                        >
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-black/10 rounded-full flex items-center justify-center text-xl md:text-3xl shrink-0 shadow-inner overflow-hidden">
                                {profile.icon}
                            </div>
                            <h3 className="text-lg md:text-2xl font-bold text-black shrink-0">
                                {profile.title}
                            </h3>
                            <p className="text-sm md:text-base text-black w-full md:w-auto">
                                {profile.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
