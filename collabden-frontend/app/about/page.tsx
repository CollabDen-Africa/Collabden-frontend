import React from 'react';
import Link from 'next/link';
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/homepage/Hero';
import AboutSection from '../components/about/AboutSection';
import Button from '../components/ui/Button';

export default function AboutPage() {
    const problemParagraphs = [
        "We know what it’s like to be a music creator trying to make things happen. You’re juggling files across cloud drives, messaging apps, and social platforms, chasing collaborators, and hoping nothing gets lost in the shuffle. Sometimes your track quality drops, deadlines are missed, or agreements get messy and getting paid can feel like an afterthought. We've been there, and it's frustrating.",
        "CollabDen was born from that experience. We wanted a place where creators can truly focus on what they love, making music, without worrying about scattered tools or lost work. A space where collaboration is simple, projects are easy to manage, your work is secure, and payments are straightforward. Every feature, every design choice, every tiny detail was made with one goal, to give creators a platform that feels like it was built for them, because it was.",
        "We’re not just building a tool, we’re building a community, a space where creativity flows freely, and creators can trust that their work, time, and talent are valued."
    ];

    const solutionParagraphs = [
        "We've designed CollabDen to be your creative companion, a place where everything you need to bring your music to life lives under one roof. Here you can chat with collaborators, share your tracks in pristine quality, keep projects organized without the stress, and handle agreements and payments with ease.",
        "Every feature is crafted to support you, remove the friction from your workflow, and give you the freedom to focus on what really matters, making music, sharing your ideas, and connecting with the people who help bring your vision to life. We understand the late nights, the endless back and forth across apps, and the little frustrations that can weigh you down, so we built a space that is simple, reliable, and designed to lift that weight off your shoulders.",
        "With CollabDen, collaboration feels effortless, your creative energy stays intact, and each step of your journey becomes smoother, simpler, and a little more joyful. We are here because we believe in your music, we care about your growth, and we want to make sure your talent shines without the hurdles getting in the way."
    ];

    const missionParagraphs = [
        "At CollabDen, we believe music creation should bring joy, not stress. Our mission is to make collaboration effortless and inspiring for music creators. We provide a space where your creativity can flourish, where working with others feels seamless, and where transparency and fair compensation are built into everything we do. We're here to support your journey every step of the way, so you can focus on making music that matters and building connections that last."
    ];

    const visionParagraphs = [
        "At CollabDen, we see a world where music creators across Africa and beyond can collaborate freely and confidently. A world where trusted partnerships flourish, creativity knows no limits, and every artist has the space and support to grow their craft and share their music with the world. We're building this future because your ideas, your talent, and your collaborations deserve to thrive without obstacles.",
        "CollabDen isn't just a platform; it's a place where music creators like you are understood, supported, and celebrated. Join us and step into a community where your ideas matter, your work is safe, and collaboration feels easy and joyful. We can't wait to create with you."
    ];

    return (
        <main className="min-h-screen overflow-x-hidden">
            <Navbar />

            <Hero />

            <div className="flex flex-col">
                <AboutSection
                    pillText="The Problem"
                    title="Why We Built CollabDen"
                    paragraphs={problemParagraphs}
                />

                <AboutSection
                    pillText="Our Solution"
                    title="How We Make Collaboration Easier for You"
                    paragraphs={solutionParagraphs}
                />

                <AboutSection
                    pillText="Our Mission"
                    title="What Drives Us"
                    paragraphs={missionParagraphs}
                />

                <AboutSection
                    pillText="Our Vision"
                    title="The Future We're Creating"
                    paragraphs={visionParagraphs}
                >
                    <Link href="/waitlist">
                        <Button
                            variant="primary"
                            size="md"
                            icon={BsArrowUpRightCircleFill}
                        >
                            Join the Waitlist
                        </Button>
                    </Link>
                </AboutSection>
            </div>

            <Footer />
        </main>
    );
}