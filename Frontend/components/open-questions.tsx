"use client";

import React, { useState } from "react";
import { HelpCircle, Copy, Check } from "lucide-react";
import { useAnalysis } from "./analysis-context";

export function OpenQuestions() {
  const { data, parsedQuestions } = useAnalysis();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!data?.open_questions) return;
    await navigator.clipboard.writeText(data.open_questions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasItems = parsedQuestions && parsedQuestions.length > 0;

  return (
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-2xs p-5 sm:p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200/40 dark:border-purple-800/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Open Questions
            </h3>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
              {hasItems ? `${parsedQuestions.length} pending items` : "0 items"}
            </span>
          </div>
        </div>

        {hasItems && (
          <button
            type="button"
            onClick={handleCopy}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Copy open questions"
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
            <p>No open questions found.</p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {parsedQuestions.map((question, index) => (
              <li
                key={index}
                className="p-3 rounded-xl border border-purple-200/40 dark:border-purple-900/30 bg-purple-50/20 dark:bg-purple-950/10 hover:border-purple-300 dark:hover:border-purple-800/50 transition-all flex items-start gap-2.5"
              >
                <div className="mt-0.5 text-purple-500 dark:text-purple-400 shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-snug font-normal">
                  {question}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
