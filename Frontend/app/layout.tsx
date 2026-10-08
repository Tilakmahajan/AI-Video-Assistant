import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalysisProvider } from "@/components/analysis-context";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Video Assistant | Turn Any Video Into Knowledge",
  description:
    "Transcribe, summarize, extract action items, and chat with your videos using Whisper and Gemini 3.8 Flash.",
  keywords: [
    "AI Video Assistant",
    "Video Summarizer",
    "Whisper Transcription",
    "RAG Chat",
    "Gemini 3.8 Flash",
    "Meeting Intelligence",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-300">
        <ThemeProvider>
          <AnalysisProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                <p>
                  AI Video Assistant • Powered by Whisper ASR & Gemini 3.8 Flash
                </p>
                <p className="flex items-center gap-1 font-mono text-[11px]">
                  <span>FastAPI Backend:</span>
                  <span className="text-zinc-600 dark:text-zinc-300">
                    http://127.0.0.1:8000
                  </span>
                </p>
              </div>
            </footer>
          </AnalysisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
