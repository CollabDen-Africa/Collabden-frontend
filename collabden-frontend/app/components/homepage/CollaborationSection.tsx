"use client";

import { BsArrowUpRightCircleFill, BsFillPatchCheckFill } from "react-icons/bs";
import Image from 'next/image';
import Link from 'next/link';
import Button from '../ui/Button';

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
                <div className="container mx-auto max-w-6xl text-left">
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-8 leading-tight">
                        Built with musicians. Designed for <span className="text-primary-green">professional collaboration.</span>
                    </h2>

                    <p className="text-base md:text-lg text-white text-justify max-w-6xl leading-relaxed mb-10">
                        CollabDen Africa is more than a platform. It&apos;s a movement uniting African artists, producers, and creatives across borders.
                        We&apos;re breaking down barriers to collaboration and building a global community that celebrates African music and talent.
                    </p>
                    <p className="text-base md:text-lg text-white text-justify max-w-6xl leading-relaxed mb-12">
                        From Lagos to Cape Town, from Nairobi to Accra, CollabDen connects visionary creators who are reshaping the sound of Africa.
                        Every feature is crafted by and for music professionals who know the pain of fragmented tools to help
                        collaborate smoothly, securely and professionally without juggling multiple disconnected tools.
                    </p>

                    <Link href="/about">
                        <Button variant="white" size="md" icon={BsArrowUpRightCircleFill}>
                            Learn More About CollabDen
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Part 2: Waitlist Section */}
            <div className="relative py-24 px-6 overflow-hidden">
                {/* Map Watermark */}
                <div className="absolute inset-0 opacity-80 pointer-events-none flex items-center justify-center">
                    <div className="relative w-full h-full max-w-4xl max-h-[600px]">
                        <Image
                            src="/map.png"
                            alt="Africa Map"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                <div className="container mx-auto max-w-6xl z-10">
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-12">
                        Be Among The First To Collaborate On <span className="text-primary-green">CollabDen Africa</span>
                    </h2>

                    <p className="text-base md:text-lg text-white mb-10 max-w-5xl">
                        Join a growing community of music professionals preparing to collaborate more efficiently, securely, and professionally all in one place. Early access to CollabDen means:
                    </p>

                    <ul className="space-y-6 mb-16 max-w-3xl">
                        {benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                                <div className="rounded-full flex items-center justify-center mr-4 mt-1">
                                    <BsFillPatchCheckFill className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-white text-base md:text-lg">{benefit}</span>
                            </li>
                        ))}
                    </ul>

                    <Button variant="white" size="lg" icon={BsArrowUpRightCircleFill}>
                        Join the Waitlist
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default CollaborationSection;
