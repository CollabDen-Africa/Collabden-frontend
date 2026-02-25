"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Marketplace', href: '/marketplace' },
    ];

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50">
            <div className="bg-white/40 backdrop-blur-md border border-white/10 rounded-full px-8 py-3 flex items-center justify-between shadow-2xl">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo-collabden.svg"
                        alt="CollabDen Logo"
                        width={250}
                        height={250}
                        className="h-8 w-auto object-contain"
                    />
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-white/80 hover:text-white transition-colors text-md font-semibold"
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
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden mt-4 bg-[#204F99]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl animate-in fade-in slide-in-from-top-4">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-white text-lg font-medium py-2 border-b border-white/5"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-col gap-4">
                        <Link
                            href="/login"
                            className="text-white/90 text-center py-2 font-semibold"
                            onClick={() => setIsOpen(false)}
                        >
                            Log in
                        </Link>
                        <Button variant="primary" size="md">
                            Sign Up
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
