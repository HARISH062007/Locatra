import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

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
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${sora.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
