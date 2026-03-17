"use client";
import React from 'react';
import { motion } from "framer-motion";
import Pill from '../ui/Pill';

interface AboutSectionProps {
    pillText: string;
    title: string;
    paragraphs: string[];
    children?: React.ReactNode;
}

const AboutSection: React.FC<AboutSectionProps> = ({ pillText, title, paragraphs, children }) => {
    return (
        <section className="relative py-20 px-6 overflow-hidden">
            <div className="container mx-auto max-w-6xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 flex justify-center"
                >
                    <Pill text={pillText} />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-2xl md:text-4xl font-bold text-white mb-10"                 >
                    {title}
                </motion.h2>

                <div className="space-y-4 max-w-6xl mx-auto text-left">
                    {paragraphs.map((para, index) => (
                        <motion.p
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                            className="text-base md:text-md text-white/90 leading-relaxed"
                        >
                            {para}
                        </motion.p>
                    ))}
                </div>

                {children && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-12 flex justify-start"
                    >
                        {children}
                    </motion.div>
                )}
            </div>
        </section >
    );
};

export default AboutSection;
