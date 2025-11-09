import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UTSML App",
  description: "Aplikasi Machine Learning modern berbasis Next.js, TypeScript, Tailwind CSS, dan shadcn/ui.",
  keywords: ["Machine Learning", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "React"],
  authors: [{ name: "UTSML Team" }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: "UTSML App",
    description: "Aplikasi Machine Learning modern berbasis Next.js, TypeScript, Tailwind CSS, dan shadcn/ui.",
    url: "",
    siteName: "UTSML",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UTSML App",
    description: "Aplikasi Machine Learning modern berbasis Next.js, TypeScript, Tailwind CSS, dan shadcn/ui.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
