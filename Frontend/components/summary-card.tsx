"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  FileText,
  CheckSquare,
  KeyRound,
  HelpCircle,
  Clock,
} from "lucide-react";
import { useAnalysis } from "./analysis-context";
import { estimateReadTime } from "@/lib/utils";

export function SummaryCard() {
  const {
    data,
    parsedActionItems,
    parsedDecisions,
    parsedQuestions,
  } = useAnalysis();
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const handleCopySummary = async () => {
    await navigator.clipboard.writeText(data.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const transcriptWords = data.transcript
    ? data.transcript.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const metrics = [
    {
      label: "Transcript",
      value: `${transcriptWords.toLocaleString()} words`,
      sub: "Whisper 16kHz ASR",
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200/40 dark:border-blue-900/40",
    },
    {
      label: "Action Items",
      value: `${parsedActionItems.length} tasks`,
      sub: parsedActionItems.length > 0 ? "With owners/deadlines" : "None detected",
      icon: CheckSquare,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/40 dark:border-emerald-900/40",
    },
    {
      label: "Key Decisions",
      value: `${parsedDecisions.length} recorded`,
      sub: parsedDecisions.length > 0 ? "Strategic agreements" : "None detected",
      icon: KeyRound,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200/40 dark:border-amber-900/40",
    },
    {
      label: "Open Questions",
      value: `${parsedQuestions.length} pending`,
      sub: parsedQuestions.length > 0 ? "Unresolved items" : "None detected",
      icon: HelpCircle,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200/40 dark:border-purple-900/40",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Metadata */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300">
          <Sparkles className="w-3 h-3" />
          <span>AI-Generated Title</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
          {data.title || "Untitled Video Analysis"}
        </h1>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-2xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {metric.label}
                </span>
                <div className={`p-1.5 rounded-md border ${metric.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${metric.color}`} />
                </div>
              </div>
              <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {metric.value}
              </div>
              <div className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">
                {metric.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Executive Summary Card */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/70 shadow-xs p-5 sm:p-7 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Executive Summary
            </h2>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              • {estimateReadTime(data.summary)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 px-2.5 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>

        <div className="text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
          {data.summary}
        </div>
      </div>
    </div>
  );
}
