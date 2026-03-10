"use client";

import Image from 'next/image';
import { RiInstagramFill, RiLinkedinBoxFill, RiFacebookBoxFill, RiTwitterXFill, RiWhatsappFill, RiMailFill } from 'react-icons/ri';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
    const socialLinks = [
        { Icon: RiInstagramFill, label: "Instagram", href: "https://instagram.com/collabdenafrica" },
        { Icon: RiLinkedinBoxFill, label: "LinkedIn", href: "https://linkedin.com/company/collabdenafrica" },
        { Icon: RiFacebookBoxFill, label: "Facebook", href: "https://facebook.com/collabdenafrica" },
        { Icon: RiTwitterXFill, label: "X", href: "https://x.com/collabdenafrica" },
    ];

    const linkSections = [
        {
            title: "Explore",
            links: [
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Features", href: "/#what-we-offer" },
                { label: "How It Works", href: "/#how-it-works" },
                { label: "Community", href: "/community" },
            ],
            className: "lg:pl-8"
        },
        {
            title: "Legal",
            links: [
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms Of Service", href: "/terms" },
            ]
        },
    ];

    const contactItems = [
        { Icon: RiWhatsappFill, text: "+234 816 2345 678", href: "https://wa.me/2348162345678" },
        { Icon: RiMailFill, text: "Collabdenafrica@gmail.com", href: "mailto:Collabdenafrica@gmail.com" },
    ];

    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mt-24"
        >
            {/* SVG shape to replace the CSS clip-path so we can add a white top border stroke */}
            <div className="hidden md:block absolute top-0 left-0 w-full overflow-hidden leading-0 transform -translate-y-[99%]">
                <svg
                    className="relative block w-full h-[8vw] min-h-[50px] max-h-[120px]"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 15V0L75 15L100 0V15H0Z"
                        className="fill-white/10"
                    />
                    <path
                        d="M0 0L75 15L100 0"
                        stroke="white"
                        strokeWidth="0.2"
                        strokeOpacity="0.4"
                        fill="none"
                    />
                </svg>
            </div>

            <div className="relative bg-white/10 backdrop-blur-md z-10 pt-6 pb-4 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                        {/* Company Info */}
                        <div className="space-y-2">
                            <Link href="/" className="relative flex items-center">
                                <Image
                                    src="/collabden-logo.png"
                                    alt="CollabDen Logo"
                                    width={500}
                                    height={500}
                                    className="h-14 w-auto object-contain"
                                    priority
                                />
                            </Link>
                            <p className="text-white max-w-xs text-sm leading-snug">
                                All-in-one collaboration platform for music professionals
                            </p>
                            <div className="flex gap-2">
                                {socialLinks.map(({ Icon, label, href }) => (
                                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-white transition-transform hover:scale-110 hover:text-primary-green" aria-label={label}>
                                        <Icon className="w-6 h-6" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Link Sections (Explore & Legal) */}
                        {linkSections.map(({ title, links, className: sectionClass }) => (
                            <div key={title} className={`space-y-2 ${sectionClass || ""}`}>
                                <h3 className="text-lg font-semibold text-white tracking-wider">{title}</h3>
                                <ul className="space-y-2">
                                    {links.map(({ label, href }) => (
                                        <li key={label}>
                                            <Link
                                                href={href}
                                                className="text-sm text-white hover:text-primary-green hover:underline transition-colors"
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Contact */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-white tracking-wider">Contact</h3>
                            {contactItems.map(({ Icon, text, href }) => (
                                <a key={text} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                                    <div className="flex items-center justify-center text-white transform group-hover:scale-110 transition-transform">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-white/90 text-sm font-medium group-hover:text-primary-green hover:underline transition-colors">{text}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/80 px-6 py-3">
                    <div className="max-w-5xl">
                        <p className="text-white flex items-start font-medium text-sm">
                            ©2026 CollabDen. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
