import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, Show, UserButton } from "@clerk/nextjs";
import "katex/dist/katex.min.css";
import "@crayonai/react-ui/styles/index.css";
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
  title: "Toolix AI - Tool-Enabled AI Agent",
  description: "Tool-Enabled AI Agent",
  keywords: [
    "AI",
    "assistant",
    "weather",
    "calculations",
    "code",
    "math",
    "chatbot",
  ],
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
    description:
      "Your intelligent assistant for weather queries, mathematical calculations, code generation, and more.",
    type: "website",
    siteName: "Toolix AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toolix AI - Tool-Enabled AI Agent",
    description:
      "Your intelligent assistant for weather queries, mathematical calculations, code generation, and more.",
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
        <ClerkProvider>
          <header className="fixed top-4 right-4 z-50 flex items-center">
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
