"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

const Hero = () => {
    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Video Background Container - pushed down */}
            <div className="absolute top-15 inset-x-0 bottom-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover opacity-80"
                >
                    <source src="hero_video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Overall Dark Overlay for video contrast */}
            <div className="absolute inset-0 bg-black/70 z-10" />

            {/* Top Blue Gradient - Rounded and centered behind navbar */}
            <div className="absolute top-0 left-[50%] -translate-x-1/2 w-[90%] max-w-full h-[30vh] z-10 bg-[radial-gradient(ellipse_at_top,var(--primary-blue)_0%,transparent_70%)] opacity-80 blur-2xl" />

            {/* Hero Content */}
            <div className="relative z-20 container mx-auto px-6 text-center text-white">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold max-w-5xl mx-auto mt-6 leading-tight md:leading-tight mb-8">
                    Where Africa&apos;s Music Professionals Collaborate, Get Paid, And Grow
                </h1>

                <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
                    Stop juggling tools. Seamlessly share files, communicate, manage projects, and get paid all in one place.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Button variant="white" size="lg">
                        Learn how it works
                    </Button>
                    <Button
                        variant="primary"
                        size="lg"
                        icon={ArrowRight}
                    >
                        Join the Waitlist
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
