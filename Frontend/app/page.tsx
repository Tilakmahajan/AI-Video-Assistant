"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Layers,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Hero } from "@/components/hero";
import { LoadingState } from "@/components/loading-state";
import { useAnalysis } from "@/components/analysis-context";

export default function HomePage() {
  const { status, data } = useAnalysis();

  return (
    <div className="flex-1 flex flex-col">
      {/* If currently processing an analysis, show the loading experience */}
      {status === "processing" ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <LoadingState />
        </div>
      ) : (
        <>
          {/* Active analysis notification banner if user returns to home while data is loaded */}
          {data && (
            <div className="bg-indigo-50/80 dark:bg-indigo-950/40 border-b border-indigo-200/60 dark:border-indigo-900/40 py-2.5 px-4 text-center text-xs">
              <span className="text-zinc-700 dark:text-zinc-300">
                You have an active analysis ready:{" "}
                <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  {data.title}
                </strong>
              </span>
              <Link
                href="/analysis"
                className="ml-2.5 inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>Open Workspace</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Hero Section with Input Form & Feature Highlights */}
          <Hero />

          {/* How It Works Section */}
          <section className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-900/30 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  How It Works
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                  From Raw Video to Structured Intelligence
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  A high-throughput pipeline designed for low latency and high extraction accuracy.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    Audio Ingestion & Chunking
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Downloads YouTube audio or ingests local media files, downsampling to 16kHz WAV and splitting into 10-minute parallel segments.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    Whisper & Gemini Inference
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Whisper accurately transcribes dialogue with punctuation. Gemini 3.8 Flash synthesizes key decisions, deadlines, owners, and questions.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    FAISS Vector Store & RAG Chat
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Chunks are indexed into a local FAISS vector database. Ask any question in natural language to retrieve grounded verbatim context.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
