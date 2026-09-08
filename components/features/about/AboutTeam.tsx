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
}

const TEAM_MEMBERS: TeamMember[] = [
  // 1. Founder
  {
    id: "1",
    name: "Emmanuel Odo",
    role: "Founder",
    description:
      "Dedicated to ensuring creators can work together seamlessly regardless of their location, specialties and level of expertise.",
    image: "/team-info/Emmanuel Odo.webp",
  },
  // 2. Product Manager
  {
    id: "2",
    name: "Uchechukwu Anointing",
    role: "Product Manager",
    description:
      "I joined CollabDen because, after speaking with the founder, I understood the vision and could see it coming to life. I saw a real problem that needed a solution, and I believed CollabDen could provide that solution. As someone who loves solving problems, I saw an opportunity to help build something meaningful that addresses a real need.",
    image: "/team-info/Anointing Uche.webp",
  },
  // 3. Frontend Developers
  {
    id: "3",
    name: "Mmesoma S. Nzeribe",
    role: "Frontend Developer",
    description:
      "I joined because I needed the experience but I'm loving it regardless.",
    image: "/team-info/Mmesoma Nzeribe.webp",
  },
  {
    id: "4",
    name: "Chidimma Joan Nwankwo",
    role: "Frontend Developer",
    description:
      "It just felt natural. As someone interested in music, I couldn't help but jump at the chance to be part of this project. A collaborative space for musicians that streamlines the process? And I get to be part of that? Say no more!",
    image: "/team-info/Mmesoma Nzeribe.webp",
  },
  // 4. Backend Engineers
  {
    id: "5",
    name: "Godswill Ochi",
    role: "Backend Engineer",
    description:
      "I joined CollabDen because I find the platform interesting and believe it addresses a real problem in the African music space.",
    image: "/team-info/Godswill Ochi.webp",
  },
  {
    id: "6",
    name: "Ogbonna Nmesoma Anita",
    role: "Backend Engineer",
    description:
      "I work with CollabDen because I see it as a platform that can create real opportunities for Nigerians in the music industry. With the rapid growth of Africa's music scene, I believe there is a need for platforms that help people connect, collaborate, develop their skills, and grow their careers. I'm excited to be part of building something that can help talented people discover opportunities and reach their full potential.",
    image: "/team-info/Anita Nmesoma.webp",
  },
  // 5. Designers & Creative Designers
  {
    id: "7",
    name: "Oluwseun O. Babalola",
    role: "Product Designer",
    description:
      "I love how CollabDen pushed me beyond my comfort zone and introduced me to an industry I knew little about. I joined to learn, grow and challenge myself by designing for a completely unfamiliar community.",
    image: "/team-info/Oyinda Babalola.webp",
  },
  {
    id: "8",
    name: "Panugo Otosede Edith",
    role: "Creative Designer",
    description:
      "I joined CollabDen because I believe in the vision behind what is being built. I wanted to be part of this amazing movement, contribute my skills, collaborate with like-minded people, and be part of creating meaningful impact.",
    image: "/team-info/Edith Panugo.webp",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-14 md:gap-y-16">
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: (index % 4) * 0.1,
                ease: "easeOut",
              }}
              className="flex flex-col items-start text-left group"
            >
              {/* Circular Avatar */}
              <div
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shrink-0 border border-white/10 bg-card-bg/40"
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
