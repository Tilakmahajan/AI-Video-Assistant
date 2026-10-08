"use client";

import React from "react";
import Link from "next/link";
import { Video, ArrowRight, Sparkles } from "lucide-react";
import { useAnalysis } from "./analysis-context";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No video analyzed yet",
  description = "Paste a YouTube URL or upload a file to get started.",
  actionText,
  onAction,
}: EmptyStateProps) {
  const { loadSampleAnalysis } = useAnalysis();

  return (
    <div className="w-full max-w-xl mx-auto py-16 px-4 text-center">
      <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 p-8 sm:p-12 flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center mb-5 shadow-2xs">
          <Video className="w-7 h-7 text-indigo-500/80" />
        </div>

        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          {title}
        </h3>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {actionText && onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-semibold shadow-xs transition-colors"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Analyze a Video</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            type="button"
            onClick={loadSampleAnalysis}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Load Sample Meeting</span>
          </button>
        </div>
      </div>
    </div>
  );
}
