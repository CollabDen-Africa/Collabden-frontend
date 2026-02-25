"use client";

import React from 'react';

const FragmentationSection = () => {
    const cards = [
        {
            title: "Scattered tools across platforms",
            description: "Producers, vocalists, and engineers working with different software and services",
            isHighlighted: false,
        },
        {
            title: "File quality loss during sharing",
            description: "Audio files compressed or corrupted when passed through email and messaging apps",
            isHighlighted: true,
        },
        {
            title: "Payment and agreement friction",
            description: "Complex contracts and slow payment processing slow down collaboration workflows",
            isHighlighted: false,
        },
    ];

    return (
        <section className="relative py-20 px-6 overflow-hidden">
            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        The Fragmentation Problem
                    </h2>
                    <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
                        Music collaboration is broken. it currently relies on juggling multiple disconnected tools for files, communication, and payments.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 items-stretch">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className={`relative p-8 flex flex-col justify-center min-h-[320px] transition-all duration-300 ${card.isHighlighted
                                ? "bg-primary-green text-white z-20 rounded-2xl md:scale-105 shadow-2xl"
                                : "bg-white/20 backdrop-blur-md text-white/90 z-10 border border-white/10 first:rounded-l-2xl last:rounded-r-2xl max-md:rounded-2xl max-md:my-4"
                                }`}
                        >
                            <h3 className={`text-xl font-bold mb-6 ${card.isHighlighted ? "text-white" : "text-white/90"}`}>
                                {card.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${card.isHighlighted ? "text-white/90" : "text-white/70"}`}>
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FragmentationSection;
