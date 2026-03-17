"use client";

import { useEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import Button from './Button';
import Link from 'next/link';
import { IoRocketOutline } from 'react-icons/io5';
import { createPortal } from 'react-dom';

interface UpcomingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const emptySubscribe = () => () => { };

const UpcomingModal = ({ isOpen, onClose }: UpcomingModalProps) => {
    const isMounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isMounted) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-black/90 border border-white/10 w-full max-w-xl rounded-[2.5rem] px-6 py-8 relative shadow-[0_0_100px_rgba(31,253,5,0.1)] pointer-events-auto overflow-hidden"
                    >
                        {/* Decorative Background Glows */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-green/20 blur-[80px] rounded-full -mr-32 -mt-32 animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-blue/10 blur-[60px] rounded-full -ml-24 -mb-24" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 text-white/20 hover:text-white transition-all p-2 rounded-full hover:bg-white/5 group z-10"
                        >
                            <HiX size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        <div className="flex flex-col items-center text-center relative z-0">
                            <motion.div
                                initial={{ rotate: -10, scale: 0.8 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="w-20 h-20 bg-linear-to-br from-primary-green/20 to-primary-green/5 rounded-3xl flex items-center justify-center mb-8 border border-primary-green/30 shadow-[0_0_30px_rgba(31,253,5,0.2)]"
                            >
                                <IoRocketOutline className="text-primary-green animate-bounce" size={40} />
                            </motion.div>

                            <h2 className="text-2xl md:text-4xl font-black text-white mb-6 tracking-tight leading-tight">
                                We are almost <span className="text-primary-green">ready!</span>
                            </h2>

                            <p className="text-white/50 text-base md:text-lg leading-relaxed mb-10 font-medium">
                                CollabDen is currently under development. We are crafting the future of music collaboration.
                            </p>

                            <div className="flex flex-col w-full gap-4">
                                <Link href="/waitlist" className="w-full" onClick={onClose}>
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button variant="primary" size="md" className="w-full text-lg font-bold shadow-[0_10px_30px_rgba(31,253,5,0.3)]">
                                            Join the Waitlist
                                        </Button>
                                    </motion.div>
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="text-white/30 hover:text-white transition-colors font-bold text-sm tracking-widest uppercase mt-4"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
};

export default UpcomingModal;
