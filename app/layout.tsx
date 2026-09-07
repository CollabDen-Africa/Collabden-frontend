import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/components/providers/QueryProvider";
import NextTopLoader from "nextjs-toploader";



import JsonLd from "@/components/seo/JsonLd";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://collabden.africa"),
  title: {
    default: "CollabDen | Music Collaboration & Workspace for African Creators",
    template: "%s | CollabDen",
  },
  description:
    "Where Africa's music professionals collaborate, share high-quality audio files, manage projects, execute legal agreements, and get paid securely in one centralized workspace.",
  keywords: [
    "music collaboration platform",
    "African music producers",
    "music creators workspace",
    "music project management",
    "audio file sharing",
    "music contract templates",
    "music escrow payments",
    "Afrobeats collaboration",
    "sound engineers Africa",
    "songwriters collaboration",
  ],
  authors: [{ name: "CollabDen" }],
  creator: "CollabDen",
  publisher: "CollabDen",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://collabden.africa",
    siteName: "CollabDen",
    title: "CollabDen | Music Collaboration & Workspace for African Creators",
    description:
      "Where Africa's music professionals collaborate, share high-quality audio files, manage projects, and get paid securely.",
    images: [
      {
        url: "/collabden-logo.png",
        width: 1200,
        height: 630,
        alt: "CollabDen - Where Africa's Music Professionals Collaborate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CollabDen | Music Collaboration & Workspace for African Creators",
    description:
      "Where Africa's music professionals collaborate, share high-quality audio files, manage projects, and get paid securely.",
    images: ["/collabden-logo.png"],
    creator: "@Collabdenafrica",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/Green-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/Green-logo.png", sizes: "180x180", type: "image/png" }],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://collabden.africa/#organization",
      name: "CollabDen",
      url: "https://collabden.africa",
      logo: {
        "@type": "ImageObject",
        "@id": "https://collabden.africa/#logo",
        url: "https://collabden.africa/Green-logo.png",
        contentUrl: "https://collabden.africa/Green-logo.png",
        caption: "CollabDen Logo",
      },
      sameAs: [
        "https://www.instagram.com/the.collabdenafrica?igsh=cnlrejZlanh2dzB4",
        "https://www.linkedin.com/company/collabden-africa",
        "https://facebook.com/collabdenafrica",
        "https://x.com/Collabdenafrica",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+2347055573598",
          contactType: "customer service",
          email: "collabdenafrica@gmail.com",
          availableLanguage: ["English"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://collabden.africa/#website",
      url: "https://collabden.africa",
      name: "CollabDen",
      description:
        "Where Africa's music professionals collaborate, share high-quality audio files, manage projects, and get paid securely.",
      publisher: {
        "@id": "https://collabden.africa/#organization",
      },
      inLanguage: "en-US",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} antialiased relative overflow-x-hidden`}
        suppressHydrationWarning
      >
        <JsonLd data={organizationSchema} />
        <QueryProvider>
          <AuthProvider>
            <NextTopLoader
              color="#73BF44"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #73BF44, 0 0 5px #73BF44"
            />
            <div className="content-wrapper">
              {children}
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

