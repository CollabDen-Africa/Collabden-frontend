"use client";
import { motion } from "framer-motion";
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
        "Access to trusted collaborators beyond your networkized agreements",
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <section className="relative overflow-hidden">

            {/* Part 1: Built with Musicians */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative py-24 px-6 bg-white/10 backdrop-blur-md border-t border-white/10"
            >
                <div className="container mx-auto max-w-6xl text-left">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-2xl md:text-4xl font-bold text-white mb-8 leading-tight"
                    >
                        Built with musicians. Designed for <span className="text-primary-green">professional collaboration.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-base md:text-lg text-white text-justify max-w-6xl leading-relaxed mb-10"
                    >
                        CollabDen Africa is more than a platform. It&apos;s a movement uniting African artists, producers, and creatives across borders.
                        We&apos;re breaking down barriers to collaboration and building a global community that celebrates African music and talent.
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="text-base md:text-lg text-white text-justify max-w-6xl leading-relaxed mb-12"
                    >
                        From Lagos to Cape Town, from Nairobi to Accra, CollabDen connects visionary creators who are reshaping the sound of Africa.
                        Every feature is crafted by and for music professionals who know the pain of fragmented tools to help
                        collaborate smoothly, securely and professionally without juggling multiple disconnected tools.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <Link href="/about">
                            <Button variant="white" size="md" icon={BsArrowUpRightCircleFill}>
                                Learn More About CollabDen
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </motion.div>

            {/* Part 2: Waitlist Section */}
            <div className="relative py-24 px-6 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 0.8, scale: 1 }}
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        opacity: { duration: 1.5 }
                    }}
                    className="absolute inset-0 pointer-events-none flex items-center justify-center"
                >
                    <div className="relative w-full h-full max-w-4xl max-h-[600px]">
                        <Image
                            src="/map.png"
                            alt="Africa Map"
                            fill
                            className="object-contain"
                        />
                    </div>
                </motion.div>

                <div className="container mx-auto max-w-6xl z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-2xl md:text-4xl font-bold text-white mb-12"
                    >
                        Be Among The First To Collaborate On <span className="text-primary-green">CollabDen Africa</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base md:text-lg text-white mb-10 max-w-5xl"
                    >
                        Join a growing community of music professionals preparing to collaborate more efficiently, securely, and professionally all in one place. Early access to CollabDen means:
                    </motion.p>

                    <motion.ul
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-6 mb-16 max-w-3xl"
                    >
                        {benefits.map((benefit, index) => (
                            <motion.li
                                key={index}
                                variants={itemVariants}
                                className="flex items-start"
                            >
                                <div className="rounded-full flex items-center justify-center mr-4 mt-1">
                                    <BsFillPatchCheckFill className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-white text-base md:text-lg">{benefit}</span>
                            </motion.li>
                        ))}
                    </motion.ul>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <Link href="/waitlist">
                            <Button
                                variant="white"
                                size="lg"
                                icon={BsArrowUpRightCircleFill}
                            >
                                Join the Waitlist
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CollaborationSection;
