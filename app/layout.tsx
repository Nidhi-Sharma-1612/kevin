import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const title = "La Conciergerie Del Sol | Torremolinos Vacation Rentals";
const description =
  "Curated apartments in Torremolinos, Costa del Sol — sea views, private pools and a dedicated concierge team for an unforgettable Andalusian stay.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_US",
    siteName: "La Conciergerie Del Sol",
    images: ["/icon.png"],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="pt-18">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
