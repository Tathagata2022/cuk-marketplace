import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import OnboardingGuard from "@/components/OnboardingGuard";
import PWARegister from "@/components/PWARegister";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CUK Marketplace",
  description: "A managed marketplace for university students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <PWARegister />
          <OnboardingGuard />
          <div className="flex flex-col flex-grow">
            {children}
          </div>
          <BottomNav />
          <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        </Providers>
      </body>
    </html>
  );
}
