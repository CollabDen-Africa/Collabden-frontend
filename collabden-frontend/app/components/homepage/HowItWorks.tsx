"use client";

import React from 'react';
// import { UserPlus, Search, Users, Wallet } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            title: "Create Your Profile",
            description: "Sign up and showcase your skills. Add your music, credentials, and collaboration interests",
            icon: 1,
            rotation: "-rotate-3 translate-y-4",
        },
        {
            title: "Discover & Connect",
            description: "Browse the marketplace. Find collaborators and projects that match your style and goals.",
            icon: 2,
            rotation: "-rotate-1",
        },
        {
            title: "Collaborate",
            description: "Work together in real-time. Share files, chat, manage tasks, and track progress.",
            icon: 3,
            rotation: "rotate-1",
        },
        {
            title: "Get Paid",
            description: "Automatic royalty splitting. Instant payments to your wallet",
            icon: 4,
            rotation: "rotate-3 translate-y-4",
        },
    ];

    const profiles = [
        {
            title: "Producers",
            description: "Collaborate on beats, samples, and arrangements",
            icon: "🎧",
            offset: "z-40",
            rotation: "-rotate-1"
        },
        {
            title: "Vocalists",
            description: "Share recordings and get feedback instantly",
            icon: "🎤",
            offset: "z-30 -mt-6 ml-4",
            rotation: "rotate-1"
        },
        {
            title: "Engineers",
            description: "Mix and master with the whole team",
            icon: "🎚️",
            offset: "z-20 -mt-6 -ml-2",
            rotation: "-rotate-1"
        },
        {
            title: "Songwriters",
            description: "Co-write and manage publishing agreements",
            icon: "✍️",
            offset: "z-10 -mt-6 ml-2",
            rotation: "rotate-1"
        },
    ];

    return (
        <section className="relative py-24 px-6 backdrop-blur-md overflow-hidden">
            <div className="container mx-auto max-w-6xl relative z-10">
                {/* How It Works Section */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        How It Works
                    </h2>
                    <p className="text-lg text-white/70">
                        Simple steps to start your next collaboration
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-32 perspective-1000">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`relative bg-[#444444] border border-primary-green/30 rounded-2xl p-8 pt-10 min-h-[250px] transition-transform duration-500 hover:scale-105 hover:z-50 ${step.rotation} max-md:rotate-0 max-md:translate-y-0 shadow-xl`}
                        >
                            <h3 className="text-xl font-bold text-white mb-4">
                                {step.title}
                            </h3>
                            <p className="text-sm text-white/70 leading-relaxed mb-10">
                                {step.description}
                            </p>
                            <div className="absolute bottom-6 left-6 w-8 h-8 bg-primary-green rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {step.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Built For Everyone Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Built For Everyone In <span className="text-primary-green">Music</span>
                    </h2>
                    <p className="text-lg text-white/70">
                        Built with musicians. Designed for professional collaboration.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto flex flex-col items-center">
                    {profiles.map((profile, index) => (
                        <div
                            key={index}
                            style={{
                                background: 'linear-gradient(180deg, #FFFFFF 0%, #999999 100%)'
                            }}
                            className={`w-full max-w-3xl flex items-center p-4 md:p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] ${profile.offset} ${profile.rotation} border border-white/20`}
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-black/10 rounded-full flex items-center justify-center text-3xl md:text-4xl mr-6 shadow-inner overflow-hidden">
                                {profile.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl md:text-3xl font-bold text-black mb-1">
                                    {profile.title}
                                </h3>
                                <p className="text-sm md:text-base text-black/70">
                                    {profile.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
