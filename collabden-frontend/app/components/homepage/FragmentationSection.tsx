"use client";

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
}: {
    title: string;
    description: string;
    isCenter?: boolean;
}) => (
    <div
        className={`rounded-[20px] p-6 md:p-10 flex flex-col justify-center h-full ${isCenter
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
    </div>
);

const FragmentationSection = () => {
    const [left, center, right] = CARDS;

    return (
        <section className="relative py-24 px-6 overflow-hidden">
            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Heading */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        The Fragmentation Problem
                    </h2>
                    <p className="text-lg text-white max-w-3xl mx-auto leading-relaxed">
                        Music collaboration is broken. It currently relies on
                        juggling multiple disconnected tools for files,
                        communication, and payments.
                    </p>
                </div>

                {/* ── Desktop: 3-column overlapping layout ─────────── */}
                <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] max-w-6xl mx-auto items-end">
                    {/* Left card */}
                    <div className="rounded-l-[20px] overflow-hidden border-r-0 h-[260px]">
                        <FragCard {...left} />
                    </div>

                    {/* Center green card — taller than side cards */}
                    <div className="z-10 h-[340px] w-[400px] -mx-5 -mb-2">
                        <FragCard {...center} isCenter />
                    </div>

                    {/* Right card */}
                    <div className="rounded-r-[20px] overflow-hidden border-l-0 h-[260px]">
                        <FragCard {...right} />
                    </div>
                </div>

                {/* ── Mobile: stacked layout ───────────────────────── */}
                <div className="flex flex-col gap-5 md:hidden">
                    <FragCard {...left} />
                    <FragCard {...center} isCenter />
                    <FragCard {...right} />
                </div>
            </div>
        </section>
    );
};

export default FragmentationSection;
