import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "PneumoVision AI",
  description: "Diagnóstico de Tórax Potenciado por IA",
=======
  title: "NeumoVision",
  description: "Convolutional Neural Network (CNN) software to detect and analyze pneumonia in chest X-rays.",
>>>>>>> 58567374ab86cddc3f21410f6711b1b9e260c09e
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
