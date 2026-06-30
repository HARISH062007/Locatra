import type { Metadata } from "next";

import "./globals.css";
import { SpatialProvider } from "@/contexts/SpatialContext";
import { ToastProvider } from "@/components/ui/ToastProvider";



export const metadata: Metadata = {
  title: "Locatra | Your Space. Understood by AI.",
  description:
    "AI-powered AR home organization & spatial planning platform. Scan, understand, and optimize your space with spatial intelligence.",
  keywords: ["AR", "spatial intelligence", "3D scanning", "home organization", "AI placement"],
  openGraph: {
    title: "Locatra | Your Space. Understood by AI.",
    description: "Scan an object, scan your room, and let AI recommend the perfect placement.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        <SpatialProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SpatialProvider>
        
        {/* SVG Filter for Optical Crystal Glass Refraction */}
        <svg style={{ display: "none" }}>
          <defs>
            <filter id="glass-refraction">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
      </body>
    </html>
  );
}
