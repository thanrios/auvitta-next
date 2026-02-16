import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auvitta",
  description: "Auvitta is a modern, open-source, and self-hosted media server built with Next.js and TypeScript. It provides a sleek and intuitive interface for managing and streaming your media collection, including movies, TV shows, music, and photos. With support for multiple users, Auvitta allows you to share your media library with friends and family while maintaining control over access and permissions. Whether you're looking to organize your media or stream it to various devices, Auvitta offers a powerful and customizable solution for all your media needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
