import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./polish.css";
import "./readability.css";
import "./cinematic-effects.css";
import "./catalog-controls.css";
import "./mobile-audit.css";
import "./touch-audit.css";
import "./ux-fixes.css";
import "./player-sources.css";
import "./companion.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Playfair_Display({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Jordflix — Find something worth watching", template: "%s · Jordflix" },
  description: "A cinematic movie and series discovery experience with regional streaming availability, powered by TMDB.",
  applicationName: "Jordflix",
  category: "entertainment",
  keywords: ["movies", "TV series", "streaming availability", "movie discovery", "TMDB", "Jordflix"],
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  openGraph: { type: "website", siteName: "Jordflix", title: "Jordflix", description: "Find something worth watching.", url: "/" },
  twitter: { card: "summary_large_image", title: "Jordflix", description: "Find something worth watching." },
};

export const viewport: Viewport = { themeColor: "#080909", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${sans.variable} ${display.variable}`}><body><Header /><main>{children}</main><Footer /></body></html>;
}
