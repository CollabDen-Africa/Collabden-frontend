import Hero from "@/components/features/homepage/Hero";
import FragmentationSection from "@/components/features/homepage/FragmentationSection";
import OffersSection from "@/components/features/homepage/OffersSection";
import HowItWorks from "@/components/features/homepage/HowItWorks";
import CollaborationSection from "@/components/features/homepage/CollaborationSection";
import React from "react";
import MarketingPageWrapper from "@/components/layout/MarketingPageWrapper";
import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CollabDen | Music Collaboration & Workspace for African Creators",
  description:
    "Where Africa's music professionals collaborate, share high-quality audio files, manage projects, execute legal agreements, and get paid securely all in one place.",
  alternates: {
    canonical: "https://collabden.africa/",
  },
  openGraph: {
    title: "CollabDen | Where Africa's Music Professionals Collaborate, Get Paid & Grow",
    description:
      "Where Africa's music professionals collaborate, share high-quality audio files, manage projects, and get paid securely.",
    url: "https://collabden.africa/",
    siteName: "CollabDen",
    images: [
      {
        url: "/collabden-logo.png",
        width: 1200,
        height: 630,
        alt: "CollabDen Music Workspace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CollabDen | Where Africa's Music Professionals Collaborate, Get Paid & Grow",
    description:
      "Where Africa's music professionals collaborate, share high-quality audio files, manage projects, and get paid securely.",
    images: ["/collabden-logo.png"],
  },
};

const homePageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://collabden.africa/#webpage",
      url: "https://collabden.africa/",
      name: "CollabDen | Music Collaboration & Workspace for African Creators",
      isPartOf: {
        "@id": "https://collabden.africa/#website",
      },
      about: {
        "@id": "https://collabden.africa/#organization",
      },
      description:
        "Where Africa's music professionals collaborate, share high-quality audio files, manage projects, execute legal agreements, and get paid securely all in one place.",
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      name: "CollabDen",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "A centralized collaboration workspace built for African music producers, vocalists, sound engineers, and songwriters.",
    },
  ],
};

export default function Home() {
  return (
    <MarketingPageWrapper bgClass="bg-white/30">
      <JsonLd data={homePageSchema} />
      <Hero />
      <FragmentationSection />
      <OffersSection />
      <HowItWorks />
      <CollaborationSection />
    </MarketingPageWrapper>
  );
}
