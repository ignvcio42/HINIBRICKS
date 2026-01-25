import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Navbar } from "./_components/Navbar";
import { Toaster } from "~/components/ui/sonner"
import { Footer } from "./_components/Footer";

export const metadata: Metadata = {
  title: "HINIBRICKS",
  description: "HINIBRICKS",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
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
