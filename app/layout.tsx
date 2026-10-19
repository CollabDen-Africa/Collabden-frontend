import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/components/providers/QueryProvider";
import NextTopLoader from "nextjs-toploader";

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
    <html lang="en" suppressHydrationWarning>
    <head>
    {/* Anti-Flicker Theme */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
                  (function() {
                    try {
                      var theme = localStorage.getItem('app-theme') || 'default';
                      if (theme === 'system') {
                        var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
                      } else {
                        document.documentElement.setAttribute('data-theme', theme);
                      }
                    } catch (e) {}
                  })();
                `,
              }}
        />
    </head>
      <body
        className="antialiased relative overflow-x-hidden" 
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
