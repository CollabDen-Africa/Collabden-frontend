"use client";

import React from 'react';
import { Upload, ListTodo, Headphones, MessageSquare, Sparkles, CreditCard } from 'lucide-react';

const OffersSection = () => {
    const offers = [
        {
            title: "File Sharing",
            description: "Upload and share high-quality audio files instantly. Support for WAV, MP3, FLAC, and more.",
            icon: Upload,
        },
        {
            title: "Project Management",
            description: "Keep your projects organized with task boards, timelines, and milestone tracking.",
            icon: ListTodo,
        },
        {
            title: "Collaborator Marketplace",
            description: "Find producers, vocalists, and engineers.",
            icon: Headphones,
        },
        {
            title: "In-app Communication",
            description: "Work together seamlessly with real-time chat, comments, and feedback tools.",
            icon: MessageSquare,
        },
        {
            title: "AI Key & Tempo Detection",
            description: "Automatically detect key, tempo, and time signature of any audio file using advanced AI.",
            icon: Sparkles,
        },
        {
            title: "Secure Payments",
            description: "Send and receive payments securely with automatic royalty splits and invoicing.",
            icon: CreditCard,
        },
    ];

    return (
        <section className="relative py-24 px-6 backdrop-blur-md overflow-hidden">
            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        What We Offer
                    </h2>
                    <p className="text-lg text-white/70 max-w-4xl mx-auto leading-relaxed">
                        From the first file upload to the final payment, CollabDen supports the full music collaboration process in one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {offers.map((offer, index) => (
                        <div
                            key={index}
                            className="group relative bg-[#333333] rounded-4xl p-8 pt-12 overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 min-h-[300px]"
                        >
                            {/* Top right gradient decoration */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-bl from-primary-green/80 via-primary-blue/30 to-transparent opacity-60 pointer-events-none translate-x-8 -translate-y-8 blur-xl" />

                            {/* Stars/Dots decoration */}
                            <div className="absolute top-6 right-6 w-24 h-24 pointer-events-none opacity-40">
                                {[...Array(15)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute bg-white rounded-full translate-x-1"
                                        style={{
                                            width: Math.random() * 2 + 1 + 'px',
                                            height: Math.random() * 2 + 1 + 'px',
                                            top: Math.random() * 80 + '%',
                                            right: Math.random() * 80 + '%',
                                            opacity: Math.random() * 0.8 + 0.2
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Icon Circle */}
                            <div className="relative z-10 w-12 h-12 bg-primary-green rounded-full flex items-center justify-center mb-8 shadow-lg shadow-primary-green/20">
                                <offer.icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white mb-4">
                                    {offer.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-white/70">
                                    {offer.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OffersSection;
