"use client";

import React, { useState } from "react";
import { KeyRound, Copy, Check, Milestone } from "lucide-react";
import { useAnalysis } from "./analysis-context";

export function KeyDecisions() {
  const { data, parsedDecisions } = useAnalysis();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!data?.key_decisions) return;
    await navigator.clipboard.writeText(data.key_decisions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasItems = parsedDecisions && parsedDecisions.length > 0;

  return (
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-2xs p-5 sm:p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/40 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Key Decisions
            </h3>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
              {hasItems ? `${parsedDecisions.length} recorded` : "0 decisions"}
            </span>
          </div>
        </div>

        {hasItems && (
          <button
            type="button"
            onClick={handleCopy}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Copy key decisions"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mt-4 flex-1">
        {!hasItems ? (
          <div className="py-8 text-center text-zinc-400 dark:text-zinc-500 text-xs">
            <p>No key decisions found.</p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {parsedDecisions.map((decision, index) => (
              <li
                key={index}
                className="p-3 rounded-xl border border-amber-200/40 dark:border-amber-900/30 bg-amber-50/20 dark:bg-amber-950/10 hover:border-amber-300 dark:hover:border-amber-800/50 transition-all flex items-start gap-2.5"
              >
                <div className="mt-0.5 w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {index + 1}
                </div>
                <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-snug font-normal">
                  {decision}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
