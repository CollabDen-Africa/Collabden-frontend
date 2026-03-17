"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaListCheck, FaWallet } from "react-icons/fa6";
import { RiSendPlaneFill, RiHeadphoneFill } from "react-icons/ri";
import { IoChatbubblesSharp, IoSparklesSharp } from "react-icons/io5";

const OffersSection = () => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const offers = [
        {
            title: "File Sharing",
            description: "Upload and share high-quality audio files instantly. Support for WAV, MP3, FLAC, and more.",
            icon: RiSendPlaneFill,
        },
        {
            title: "Project Management",
            description: "Keep your projects organized with task boards, timelines, and milestone tracking.",
            icon: FaListCheck,
        },
        {
            title: "Collaborator Marketplace",
            description: "Find producers, vocalists, and engineers.",
            icon: RiHeadphoneFill,
        },
        {
            title: "In-app Communication",
            description: "Work together seamlessly with real-time chat, comments, and feedback tools.",
            icon: IoChatbubblesSharp,
        },
        {
            title: "Legal Agreements",
            description: "Upload legal agreements and collect secure e-signatures from collaborators directly within your project workspace.",
            icon: IoSparklesSharp,
        },
        {
            title: "Secure Payments",
            description: "Send and receive payments securely with the escrow payment system and direct payment system",
            icon: FaWallet,
        },
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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <section id="what-we-offer" className="relative py-24 px-6 backdrop-blur-md overflow-hidden">
            <div className="container mx-auto max-w-6xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        What We Offer
                    </h2>
                    <p className="text-lg text-white max-w-4xl mx-auto leading-relaxed">
                        From the first file upload to the final payment, CollabDen supports the full music collaboration process in one place.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {offers.map((offer, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
                            className="group relative bg-card-bg rounded-tl-none rounded-tr-[29px] rounded-br-none rounded-bl-[29px] p-8 pt-16 overflow-hidden transition-all duration-300 min-h-[373px] border border-white/10 shadow-lg cursor-default"
                        >
                            {/* Gradient blur ellipse */}
                            <div className="absolute w-[283px] h-[283px] left-[149px] -top-[148px] bg-linear-to-r from-primary-blue to-primary-green blur-[36px] -rotate-69 pointer-events-none" />

                            {/* Star dots */}
                            {mounted && (
                                <div className="absolute top-4 right-6 w-44 h-[118px] pointer-events-none">
                                    {[...Array(11)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-[2.5px] h-[2.5px] bg-white rounded-full"
                                            style={{
                                                top: Math.random() * 90 + '%',
                                                right: Math.random() * 90 + '%',
                                                opacity: Math.random() * 0.6 + 0.4
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Icon Circle with animation */}
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="relative z-10 w-14 h-14 bg-primary-green rounded-full flex items-center justify-center mb-8 shadow-lg shadow-primary-green/20"
                            >
                                <offer.icon className="w-7 h-7 text-white" />
                            </motion.div>

                            {/* Content */}
                            <div className="relative z-10">
                                <h3 className="text-2xl md:text-xl font-bold text-white mb-3">
                                    {offer.title}
                                </h3>
                                <p className="text-xl md:text-base leading-relaxed text-white/90">
                                    {offer.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default OffersSection;
