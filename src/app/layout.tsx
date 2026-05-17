import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Navbar } from "./_components/Navbar";
import { Toaster } from "~/components/ui/sonner"
import { Footer } from "./_components/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "HINIBRICKS",
  description: "HINIBRICKS",
  icons: {
    icon: [
      { url: "/img/favicon.ico" },
      { url: "/img/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/img/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Navbar />
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
