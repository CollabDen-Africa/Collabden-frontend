"use client";

import { CircleArrowRight } from 'lucide-react';
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

            {/* Top Blue Gradient Behind Navbar - Reduced Height */}
            <div className="absolute top-[-400px] left-1/2 -translate-x-1/2 w-[1135.24px] h-[500px] bg-[#204F99] blur-[230.762px] rounded-full z-15 pointer-events-none" />

            {/* Hero Content */}
            <div className="relative z-20 container mx-auto px-6 text-center text-white pt-24 md:pt-12">
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold max-w-5xl mx-auto mt-6 leading-tight md:leading-tight mb-6 md:mb-8">
                    Where Africa&apos;s Music Professionals Collaborate, Get Paid, And Grow
                </h1>

                <p className="text-base md:text-xl text-white/80 max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed">
                    Stop juggling tools. Seamlessly share files, communicate, manage projects, and get paid all in one place.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                    <Button
                        variant="white"
                        size="md"
                        className="w-64 sm:w-auto"
                    >
                        Learn how it works
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        icon={CircleArrowRight}
                        className="w-64 sm:w-auto"
                    >
                        Join the Waitlist
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
