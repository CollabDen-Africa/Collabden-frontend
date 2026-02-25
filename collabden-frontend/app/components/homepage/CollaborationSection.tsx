"use client";

import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const CollaborationSection = () => {
    const benefits = [
        "Centralized collaboration built for music project",
        "High-quality file sharing without loss",
        "Clear project coordination and communication",
        "Secure payments and standardized agreements",
        "Secure payments and standar Access to trusted collaborators beyond your networkized agreements",
    ];

    return (
        <section className="relative overflow-hidden">
            {/* Part 1: Built with Musicians */}
            <div className="relative py-24 px-6 bg-white/10 backdrop-blur-md border-t border-white/10">
                <div className="container mx-auto max-w-5xl text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                        Built with musicians. Designed for <span className="text-primary-green">professional collaboration.</span>
                    </h2>

                    <p className="text-lg text-white/70 max-w-4xl mx-auto leading-relaxed mb-12">
                        CollabDen Africa is more than a platform. It&apos;s a movement uniting African artists, producers, and creatives across borders.
                        We&apos;re breaking down barriers to collaboration and building a global community that celebrates African music and talent.
                        From Lagos to Cape Town, from Nairobi to Accra, CollabDen connects visionary creators who are reshaping the sound of Africa.
                        Every feature is crafted by and for music professionals who know the pain of fragmented tools to help
                        collaborate smoothly, securely and professionally without juggling multiple disconnected tools.
                    </p>

                    <button className="relative px-8 py-3 rounded-full border-2 border-primary-green border-dashed text-primary-green font-semibold hover:bg-primary-green/10 transition-colors">
                        Learn More About Collabden
                        <div className="absolute -inset-1 border border-primary-green/20 rounded-full animate-pulse pointer-events-none" />
                    </button>
                </div>
            </div>

            {/* Part 2: Waitlist Section */}
            <div className="relative py-24 px-6 overflow-hidden">
                {/* Map Watermark */}
                <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
                    <div className="relative w-full h-full max-w-4xl max-h-[600px]">
                        <Image
                            src="/map.png"
                            alt="Africa Map"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                <div className="container mx-auto max-w-5xl z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-12">
                        Be Among The First To Collaborate On <span className="text-primary-green">CollabDen Africa</span>
                    </h2>

                    <p className="text-lg text-white/80 mb-10 max-w-3xl">
                        Join a growing community of music professionals preparing to collaborate more efficiently, securely, and professionally all in one place. Early access to CollabDen means:
                    </p>

                    <ul className="space-y-6 mb-16 max-w-3xl">
                        {benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                                <div className="shrink-0 w-6 h-6 bg-primary-green rounded-full flex items-center justify-center mr-4 mt-1">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-white/90 text-lg">{benefit}</span>
                            </li>
                        ))}
                    </ul>

                    <button className="flex items-center gap-3 bg-white text-primary-green px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl">
                        Join the Waitlist
                        <div className="w-6 h-6 bg-primary-green rounded-full flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CollaborationSection;
