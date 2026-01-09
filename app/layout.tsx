import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Toolix AI - Tool-Enabled AI Agent",
  description: "Tool-Enabled AI Agent",
  keywords: ["AI", "assistant", "weather", "calculations", "code", "math", "chatbot"],
  authors: [{ name: "Khilesh Jawale" }],
  creator: "Khilesh Jawale",
  publisher: "Toolix AI",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Toolix AI - Tool-Enabled AI Agent",
    description: "Your intelligent assistant for weather queries, mathematical calculations, code generation, and more.",
    type: "website",
    siteName: "Toolix AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toolix AI - Tool-Enabled AI Agent",
    description: "Your intelligent assistant for weather queries, mathematical calculations, code generation, and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        {children}
      </body>
    </html>
  );
}
