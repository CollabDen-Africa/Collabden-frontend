import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import React from "react";

export const metadata: Metadata = {
  title: "Join the Waitlist | Get Early Access to CollabDen",
  description:
    "Be among the first music creators to experience CollabDen. Sign up for early access to our centralized music collaboration workspace and marketplace.",
  alternates: {
    canonical: "https://collabden.africa/waitlist",
  },
  openGraph: {
    title: "Join the Waitlist | Get Early Access to CollabDen",
    description:
      "Be among the first music creators to experience CollabDen. Sign up for early access to our centralized music collaboration workspace.",
    url: "https://collabden.africa/waitlist",
    siteName: "CollabDen",
    images: [
      {
        url: "/collabden-logo.png",
        width: 1200,
        height: 630,
        alt: "Join CollabDen Early Access Waitlist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the Waitlist | Get Early Access to CollabDen",
    description:
      "Be among the first music creators to experience CollabDen. Sign up for early access.",
    images: ["/collabden-logo.png"],
  },
};

const waitlistSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://collabden.africa/waitlist#webpage",
  url: "https://collabden.africa/waitlist",
  name: "Join the Waitlist | CollabDen",
  isPartOf: {
    "@id": "https://collabden.africa/#website",
  },
  about: {
    "@id": "https://collabden.africa/#organization",
  },
  description:
    "Sign up for early access to CollabDen, the centralized workspace for African music producers, vocalists, sound engineers, and songwriters.",
  inLanguage: "en-US",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://collabden.africa/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Waitlist",
        item: "https://collabden.africa/waitlist",
      },
    ],
  },
};

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={waitlistSchema} />
      {children}
    </>
  );
}
