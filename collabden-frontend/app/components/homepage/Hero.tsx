"use client";
import { motion, Variants } from "framer-motion";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import Link from "next/link";
import Button from '../ui/Button';

const Hero = () => {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98]
            }
        }
    };

    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">

            {/* Video Background Container - pushed down */}
            <div className="absolute top-15 inset-x-0 bottom-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="h-full w-full object-cover opacity-80"
                >
                    <source src="/Collabden-hero.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Overall Dark Overlay for video contrast */}
            <div className="absolute inset-0 bg-black/70 z-10" />

            {/* Top Blue Gradient Behind Navbar - Reduced Height */}
            <div className="absolute top-[-400px] left-1/2 -translate-x-1/2 w-[1135.24px] h-[500px] bg-[#204F99] blur-[230.762px] rounded-full z-15 pointer-events-none" />

            {/* Hero Content */}
            <motion.div
                className="relative z-20 container mx-auto px-6 text-center text-white pt-24 md:pt-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold max-w-5xl mx-auto mt-6 leading-tight md:leading-tight mb-6 md:mb-8"
                    variants={itemVariants}
                >
                    Where Africa&apos;s Music Professionals Collaborate, Get Paid, And Grow
                </motion.h1>

                <motion.p
                    className="text-base md:text-xl text-white/80 max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed"
                    variants={itemVariants}
                >
                    Stop juggling tools. Seamlessly share files, communicate, manage projects, and get paid all in one place.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
                    variants={itemVariants}
                >
                    <Button
                        variant="white"
                        size="md"
                        className="w-64 sm:w-auto"
                    >
                        Learn how it works
                    </Button>
                    <Link href="/waitlist">
                        <Button
                            variant="primary"
                            size="md"
                            icon={BsArrowUpRightCircleFill}
                            className="w-64 sm:w-auto"
                        >
                            Join the Waitlist
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
