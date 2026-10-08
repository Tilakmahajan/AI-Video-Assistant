"use client";

import React from "react";
import { Loader2, CheckCircle2, Circle, Sparkles, X } from "lucide-react";
import { useAnalysis } from "./analysis-context";

export function LoadingState() {
  const { currentStepIndex, source, resetAnalysis } = useAnalysis();

  const steps = [
    {
      label: "Extracting audio",
      detail: "Downloading stream & converting to 16kHz WAV format",
    },
    {
      label: "Transcribing video",
      detail: "Running chunked speech-to-text inference with Whisper",
    },
    {
      label: "Generating insights",
      detail: "Extracting title, summary, action items, decisions & questions",
    },
    {
      label: "Preparing AI chat",
      detail: "Vectorizing transcript chunks for conversational RAG",
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-4 sm:px-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle top indeterminate animated accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <div className="h-full w-1/3 bg-indigo-600 dark:bg-indigo-500 rounded-full animate-indeterminate" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Analyzing your video...
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs sm:max-w-md">
                {source || "Processing input"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetAnalysis}
            aria-label="Cancel analysis"
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step progression checklist */}
        <div className="space-y-4 my-6">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <div
                key={index}
                className={`flex items-start gap-3.5 p-3 rounded-xl transition-all ${
                  isCurrent
                    ? "bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60"
                    : "opacity-80"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                  ) : (
                    <Circle className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-medium ${
                        isCurrent
                          ? "text-zinc-950 dark:text-zinc-100 font-semibold"
                          : isCompleted
                          ? "text-zinc-700 dark:text-zinc-300 line-through/none"
                          : "text-zinc-400 dark:text-zinc-500"
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
                        In progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
          <span>This typically takes 15–45s depending on video length</span>
          <span className="font-mono">Whisper + Gemini 3.8</span>
        </div>
      </div>
    </div>
  );
}
