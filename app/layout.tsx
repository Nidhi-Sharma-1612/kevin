import type { Metadata } from "next";
import { cookies } from "next/headers";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Reading the language cookie server-side means the very first HTML byte
  // is already in the right language — no client-side flip after
  // hydration. That flip previously raced with Google Translate's own DOM
  // scan (which runs as soon as its script loads) and could leave stray
  // untranslated/reverted text behind depending on timing.
  const cookieStore = await cookies();
  const googtrans = cookieStore.get("googtrans")?.value ?? "";
  const initialLanguage = googtrans.split("/").filter(Boolean)[1] ?? "en";

  return (
    <html lang={initialLanguage}>
      <body className={`${fraunces.variable} ${inter.variable} antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header initialLanguage={initialLanguage} />
        <main id="main-content" className="pt-18">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
