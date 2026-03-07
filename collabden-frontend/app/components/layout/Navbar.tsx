"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Community', href: '/community' },
    ];

    return (
        <nav ref={navRef} className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white/40 backdrop-blur-md border border-white/10 rounded-full px-4 md:px-8 py-3 flex items-center justify-between shadow-2xl"
            >
                {/* Logo */}
                <Link href="/" className="relative flex items-center h-full min-w-[120px] md:min-w-[180px]">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2">
                        <Image
                            src="/collabden-logo.png"
                            alt="CollabDen Logo"
                            width={500}
                            height={500}
                            className="h-15 w-auto object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-white/80 hover:text-primary-green transition-colors text-md font-semibold"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/login" className="text-white/90 hover:text-white text-md font-semibold">
                        Log in
                    </Link>
                    <Button variant="primary" size="sm">
                        Sign Up
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white z-50 p-2"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <HiX size={20} /> : <HiMenu size={20} />}
                </button>
            </motion.div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-20 left-0 right-0 z-40 bg-primary-blue/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:hidden shadow-2xl overflow-hidden"
                    >
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-white hover:text-primary-green transition-colors py-3 px-4 rounded-xl hover:bg-white/5 text-lg font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="mt-4 pt-6 border-t border-white/10 flex flex-col gap-4 px-2">
                                <Link
                                    href="/login"
                                    className="text-white/90 text-lg font-semibold py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Log in
                                </Link>
                                <Button variant="primary" size="md" className="w-full">
                                    Sign Up
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
