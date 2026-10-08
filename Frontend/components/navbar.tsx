"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Video,
  Sparkles,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import { GithubIcon } from "./brand-icons";
import { ThemeToggle } from "./theme-toggle";
import { useAnalysis } from "./analysis-context";
import { checkApiHealth } from "@/lib/api";

export function Navbar() {
  const pathname = usePathname();
  const { data, resetAnalysis } = useAnalysis();
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkApiHealth().then((res) => setApiOnline(res.ok));
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-0.5"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-semibold shadow-sm transition-transform group-hover:scale-105">
              <Sparkles className="w-4 h-4 text-indigo-400 dark:text-indigo-600" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                AI Video Assistant
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200/70 dark:border-zinc-700/60">
                Whisper + Gemini
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                pathname === "/"
                  ? "text-zinc-950 dark:text-white bg-zinc-100 dark:bg-zinc-900"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/analysis"
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                pathname === "/analysis"
                  ? "text-zinc-950 dark:text-white bg-zinc-100 dark:bg-zinc-900"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              Analysis Workspace
              {data && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              )}
            </Link>
          </nav>
        </div>

        {/* Right Action Icons & Badges */}
        <div className="flex items-center gap-2.5">
          {/* API Status Indicator */}
          <div
            title={
              apiOnline === null
                ? "Checking FastAPI status..."
                : apiOnline
                ? "FastAPI Backend is Online (127.0.0.1:8000)"
                : "FastAPI Backend is Offline"
            }
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                apiOnline === null
                  ? "bg-zinc-400"
                  : apiOnline
                  ? "bg-emerald-500"
                  : "bg-amber-500"
              }`}
            />
            <span className="text-[11px] tracking-tight">
              {apiOnline === null
                ? "Checking API"
                : apiOnline
                ? "FastAPI Active"
                : "API Offline"}
            </span>
          </div>

          {data && (
            <Link
              href="/"
              onClick={() => resetAnalysis()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Video</span>
            </Link>
          )}

          {/* GitHub link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* Theme Switcher */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
