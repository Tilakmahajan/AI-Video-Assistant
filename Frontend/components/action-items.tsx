"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  Square,
  User,
  Calendar,
  Copy,
  Check,
  CheckCircle2,
} from "lucide-react";
import { useAnalysis } from "./analysis-context";

export function ActionItems() {
  const { data, parsedActionItems, completedTasks, toggleTaskCompleted } =
    useAnalysis();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!data?.action_items) return;
    await navigator.clipboard.writeText(data.action_items);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasItems = parsedActionItems && parsedActionItems.length > 0;

  return (
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-2xs p-5 sm:p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/40 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Action Items
            </h3>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
              {hasItems ? `${parsedActionItems.length} assigned tasks` : "0 tasks"}
            </span>
          </div>
        </div>

        {hasItems && (
          <button
            type="button"
            onClick={handleCopy}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Copy action items"
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
            <p>No action items detected.</p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {parsedActionItems.map((item, index) => {
              const isDone = !!completedTasks[item.id];
              return (
                <li
                  key={item.id || index}
                  onClick={() => toggleTaskCompleted(item.id)}
                  className={`group p-3 rounded-xl border transition-all cursor-pointer ${
                    isDone
                      ? "bg-zinc-50/60 dark:bg-zinc-950/40 border-zinc-200/50 dark:border-zinc-800/40 opacity-70"
                      : "bg-zinc-50/40 dark:bg-zinc-900/30 border-zinc-200/70 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      aria-label={isDone ? "Mark as pending" : "Mark as done"}
                      className="mt-0.5 text-zinc-400 group-hover:text-emerald-500 transition-colors shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-400 dark:text-zinc-600 group-hover:text-emerald-500" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs sm:text-sm font-medium leading-snug ${
                          isDone
                            ? "text-zinc-400 dark:text-zinc-500 line-through"
                            : "text-zinc-800 dark:text-zinc-200"
                        }`}
                      >
                        {item.task}
                      </p>

                      {(item.owner || item.deadline) && (
                        <div className="flex flex-wrap items-center gap-2 mt-2 pt-1.5 border-t border-zinc-100 dark:border-zinc-800/60 text-[11px] text-zinc-500 dark:text-zinc-400">
                          {item.owner && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                              <User className="w-3 h-3 text-zinc-400" />
                              <span>{item.owner}</span>
                            </span>
                          )}
                          {item.deadline && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                              <Calendar className="w-3 h-3 text-zinc-400" />
                              <span>{item.deadline}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
