// app/layout.tsx
import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import "./globals.css";

const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Jurix: Redefining Legal Solutions.",
  description: "Connecting Clients and Lawyers the Smarter Way.",
  // favicon - placed in /public
  icons: {
    icon: "https://www.jurix.law/favicon1.ico",
  },

  // Open Graph (social preview) - use absolute URL
  openGraph: {
    title: "Jurix: Redefining Legal Solutions.",
    description: "Connecting Clients and Lawyers the Smarter Way.",
    url: "https://www.jurix.law",
    siteName: "Jurix",
    type: "website",
    // absolute url is important for social scrapers
    images: [
      {
        url: "https://www.jurix.law/favicon1.svg",
        width: 1200,
        height: 630,
        alt: "Jurix — Connecting Clients & Lawyers",
      },
    ],
  },

  // Twitter card
  twitter: {
    card: "summary_large_image",
    title: "Jurix: Redefining Legal Solutions.",
    description: "Connecting Clients and Lawyers the Smarter Way.",
    images: ["https://www.jurix.law/favicon1.svg"],
  },

  // Optional: theme color (useful for some platforms / browsers)
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${albertSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
