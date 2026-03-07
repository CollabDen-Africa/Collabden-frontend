"use client";
import { motion } from "framer-motion";

const CARDS = [
    {
        title: "Scattered Tools Across Platforms",
        description:
            "Producers, vocalists, and engineers working with different software and services",
    },
    {
        title: "File Quality Loss During Sharing",
        description:
            "Audio files compressed or corrupted when passed through email and messaging apps",
    },
    {
        title: "Payment and Agreement Friction",
        description:
            "Complex contracts and slow payment processing slow down collaboration workflows",
    },
];

const FragCard = ({
    title,
    description,
    isCenter,
    index,
}: {
    title: string;
    description: string;
    isCenter?: boolean;
    index: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className={`rounded-[20px] p-6 md:p-10 flex flex-col justify-center h-full cursor-default ${isCenter
            ? "bg-primary-green shadow-2xl"
            : "bg-white/10 border border-white/70"
            }`}
    >
        <h3
            className={`font-bold text-white mb-4 ${isCenter ? "text-xl md:text-2xl md:mb-6" : "text-xl"
                }`}
        >
            {title}
        </h3>
        <p
            className={`text-md leading-relaxed ${isCenter ? "md:text-base text-white/90" : "text-white"
                }`}
        >
            {description}
        </p>
    </motion.div>
);

const FragmentationSection = () => {
    const [left, center, right] = CARDS;

    return (
        <section className="relative py-24 px-6 overflow-hidden">
            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        The Fragmentation Problem
                    </h2>
                    <p className="text-lg text-white max-w-3xl mx-auto leading-relaxed">
                        Music collaboration is broken. It currently relies on
                        juggling multiple disconnected tools for files,
                        communication, and payments.
                    </p>
                </motion.div>

                {/* ── Desktop: 3-column overlapping layout ─────────── */}
                <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] max-w-6xl mx-auto items-end">
                    {/* Left card */}
                    <div className="rounded-l-[20px] overflow-hidden border-r-0 h-[260px]">
                        <FragCard {...left} index={0} />
                    </div>

                    {/* Center green card — taller than side cards */}
                    <div className="z-10 h-[340px] w-[400px] -mx-5 -mb-2">
                        <FragCard {...center} index={1} isCenter />
                    </div>

                    {/* Right card */}
                    <div className="rounded-r-[20px] overflow-hidden border-l-0 h-[260px]">
                        <FragCard {...right} index={2} />
                    </div>
                </div>

                {/* ── Mobile: stacked layout ───────────────────────── */}
                <div className="flex flex-col gap-5 md:hidden">
                    <FragCard {...left} index={0} />
                    <FragCard {...center} index={1} isCenter />
                    <FragCard {...right} index={2} />
                </div>
            </div>
        </section>
    );
};

export default FragmentationSection;
