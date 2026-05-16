import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LOJJ | Front desk concierge + task tracking for hotels",
    template: "%s | LOJJ",
  },
  description:
    "Reduce front desk calls with guest FAQ automation and clear task tracking for hotel teams. One platform for requests, housekeeping, and work orders.",
  verification: {
    google: "ZMr7VRuKNlesOU6iEI1eTLLoEoNU8jW2dKOWL2YsuMY",
  },
  alternates: {
    canonical: "/",
    languages: {
      "en": "/",
      "x-default": "/",
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "LOJJ",
    title: "LOJJ — AI operations platform for hotels",
    description:
      "Reduce front desk calls with guest FAQ automation and clear task tracking for hotel teams. One platform for requests, housekeeping, and work orders.",
    images: [
      {
        url: "/concierge-cart.png",
        width: 1200,
        height: 630,
        alt: "LOJJ — hotel digital concierge and task management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LOJJ — AI operations platform for hotels",
    description:
      "Reduce front desk calls with guest FAQ automation and task tracking for hotel teams.",
    images: ["/concierge-cart.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
