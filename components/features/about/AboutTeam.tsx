"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  avatarBg?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Emmanuel Odo",
    role: "Founder",
    description:
      "Dedicated to ensuring creators can work together seamlessly regardless of their location, specialties and level of expertise",
    image: "/team-info/Emmanuel Odo.webp",
  },
  {
    id: "2",
    name: "Uchechukwu Anointing",
    role: "Product Manager",
    description:
      "Dedicated to ensuring creators can work together seamlessly regardless of their location, specialties and level of expertise",
    image: "/team-info/Anointing Uche.webp",
  },
  {
    id: "3",
    name: "Oluwseun O. Babalola",
    role: "Product Designer",
    description:
      "I love how CollabDen pushed me beyond my comfort zone and introduced me to an industry I knew little about. I joined to learn, grow and challenge myself by designing for a completely unfamiliar community.",
    image: "/team-info/Oyinda Babalola.webp",
    avatarBg: "bg-[#F97316]",
  },
  {
    id: "4",
    name: "Mmesoma S. Nzeribe",
    role: "Front-end Developer",
    description:
      "I joined because I needed the experience but I'm loving it regardless.",
    image: "/team-info/Mmesoma Nzeribe.webp",
  },
  {
    id: "5",
    name: "Godswill",
    role: "Back-end Developer",
    description:
      "Dedicated to ensuring creators can work together seamlessly regardless of their location, specialties and level of expertise",
    image: "/team-info/Godswill Ochi.webp",
  },
  {
    id: "6",
    name: "Emmanuel Odo",
    role: "Founder",
    description:
      "Dedicated to ensuring creators can work together seamlessly regardless of their location, specialties and level of expertise",
    image: "/team-info/Emmanuel Odo.webp",
  },
  {
    id: "7",
    name: "Uchechukwu Anointing",
    role: "Product Manager",
    description:
      "Dedicated to ensuring creators can work together seamlessly regardless of their location, specialties and level of expertise",
    image: "/team-info/Anointing Uche.webp",
  },
  {
    id: "8",
    name: "Oluwseun O. Babalola",
    role: "Product Designer",
    description:
      "I love how CollabDen pushed me beyond my comfort zone and introduced me to an industry I knew little about. I joined to learn, grow and challenge myself by designing for a completely unfamiliar community.",
    image: "/team-info/Oyinda Babalola.webp",
    avatarBg: "bg-[#F97316]",
  },
  {
    id: "9",
    name: "Mmesoma S. Nzeribe",
    role: "Front-end Developer",
    description:
      "I joined because I needed the experience but I'm loving it regardless.",
    image: "/team-info/Mmesoma Nzeribe.webp",
  },
  {
    id: "10",
    name: "Godswill",
    role: "Back-end Developer",
    description:
      "Dedicated to ensuring creators can work together seamlessly regardless of their location, specialties and level of expertise",
    image: "/team-info/Godswill Ochi.webp",
  },
];

export default function AboutTeam() {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="text-center mb-14 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            Meet Our Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
          >
            A team of passionate builders, creators, and problem-solvers working
            together to redefine creative collaboration.
          </motion.p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-14 md:gap-y-16">
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: (index % 5) * 0.1,
                ease: "easeOut",
              }}
              className="flex flex-col items-start text-left group"
            >
              {/* Circular Avatar */}
              <div
                className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shrink-0 border border-white/10 ${
                  member.avatarBg || "bg-card-bg/40"
                }`}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Member Details */}
              <h3 className="text-white font-bold text-base md:text-lg mt-5 mb-1 leading-snug">
                {member.name}
              </h3>

              <p className="text-accent-green-bright text-xs md:text-sm font-medium mb-3">
                {member.role}
              </p>

              <p className="text-white/70 text-xs leading-relaxed">
                {member.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
