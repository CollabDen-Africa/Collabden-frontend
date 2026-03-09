"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import Button from './Button';
import Link from 'next/link';
import { IoRocketOutline } from 'react-icons/io5';

interface UpcomingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UpcomingModal = ({ isOpen, onClose }: UpcomingModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-[#121418] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 relative shadow-[0_0_50px_rgba(0,0,0,0.5)] pointer-events-auto overflow-hidden"
                    >
                        {/* Decorative Background Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-green/10 blur-[50px] rounded-full -mr-16 -mt-16" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                        >
                            <HiX size={24} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-primary-green/10 rounded-2xl flex items-center justify-center mb-6 border border-primary-green/20">
                                <IoRocketOutline className="text-primary-green" size={32} />
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Almost There!
                            </h2>

                            <p className="text-white/60 text-lg leading-relaxed mb-8">
                                CollabDen is currently under development. We&apos;re building the ultimate workspace for African music professionals.
                            </p>

                            <div className="flex flex-col w-full gap-4">
                                <Link href="/waitlist" className="w-full" onClick={onClose}>
                                    <Button variant="primary" size="lg" className="w-full py-4 text-lg">
                                        Join the Waitlist
                                    </Button>
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="text-white/40 hover:text-white transition-colors font-medium py-2"
                                >
                                    I&apos;ll wait for now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default UpcomingModal;
