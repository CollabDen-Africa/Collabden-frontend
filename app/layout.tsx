import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/components/providers/QueryProvider";
import NextTopLoader from "nextjs-toploader";



const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CollabDen",
  description: "CollabDen Platform",
  icons: {
    icon: "/Green-logo.png",
  },
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

