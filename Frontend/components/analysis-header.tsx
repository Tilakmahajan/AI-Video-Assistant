"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Share2,
  FileText,
  Clock,
  Video,
} from "lucide-react";
import { useAnalysis } from "./analysis-context";
import { ThemeToggle } from "./theme-toggle";

export function AnalysisHeader() {
  const { data, source, resetAnalysis } = useAnalysis();
  const [copied, setCopied] = useState(false);

  const isYoutube =
    source?.includes("youtube.com") || source?.includes("youtu.be");

  const handleCopyAll = async () => {
    if (!data) return;
    const fullReport = `# ${data.title}
Source: ${source}

## Summary
${data.summary}

## Action Items
${data.action_items}

## Key Decisions
${data.key_decisions}

## Open Questions
${data.open_questions}
`;
    await navigator.clipboard.writeText(fullReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md sticky top-16 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left: Back button & Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            onClick={() => resetAnalysis()}
            aria-label="New Analysis"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>New Video</span>
          </Link>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

          {/* Source badge / Title snippet */}
          <div className="min-w-0 flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {isYoutube ? <Video className="w-3 h-3 text-red-500" /> : <FileText className="w-3 h-3 text-indigo-500" />}
              {isYoutube ? "YouTube Source" : "Audio/Video File"}
            </span>

            {isYoutube ? (
              <a
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 truncate max-w-[200px] sm:max-w-xs flex items-center gap-1"
                title={source}
              >
                <span>{source}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            ) : (
              <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[200px] sm:max-w-xs font-mono">
                {source || "Local Upload"}
              </span>
            )}
          </div>
        </div>

        {/* Right: Status badge & Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Analysis Complete</span>
          </div>

          <button
            type="button"
            onClick={handleCopyAll}
            title="Copy full analysis report"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied Report</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Export Markdown</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
