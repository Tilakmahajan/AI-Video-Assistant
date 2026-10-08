"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Sparkles,
  LayoutDashboard,
  CheckSquare,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useAnalysis } from "@/components/analysis-context";
import { AnalysisHeader } from "@/components/analysis-header";
import { SummaryCard } from "@/components/summary-card";
import { InsightsGrid } from "@/components/insight-card";
import { TranscriptViewer } from "@/components/transcript-viewer";
import { ChatPanel } from "@/components/chat-panel";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";

type WorkspaceTab = "all" | "insights" | "transcript" | "chat";

export default function AnalysisPage() {
  const { data, status, errorMessage, resetAnalysis, source, startAnalysis } =
    useAnalysis();
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("all");

  // Loading State
  if (status === "processing") {
    return (
      <div className="flex-1 flex items-center justify-center p-4 min-h-[60vh]">
        <LoadingState />
      </div>
    );
  }

  // Error State
  if (status === "error") {
    return (
      <div className="flex-1 flex items-center justify-center p-4 min-h-[60vh]">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-zinc-900 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Something went wrong while analyzing the video
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {errorMessage || "Unable to complete request. Please verify the backend service is running."}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => resetAnalysis()}
              className="px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Start Over
            </button>
            {source && (
              <button
                type="button"
                onClick={() => startAnalysis(source)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 rounded-xl transition-colors shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Empty State (no analysis data)
  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 min-h-[60vh]">
        <EmptyState
          title="No video analyzed yet"
          description="Paste a YouTube URL or upload an audio/video file to inspect transcripts, summaries, and chat with AI."
        />
      </div>
    );
  }

  // Loaded Analysis Workspace
  return (
    <div className="flex-1 flex flex-col bg-zinc-50/50 dark:bg-zinc-950">
      {/* Top Header */}
      <AnalysisHeader />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1">
        {/* Workspace Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "all"
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("insights")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "insights"
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Insights</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("transcript")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "transcript"
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Transcript</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "chat"
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>RAG Chat</span>
            </button>
          </div>

          <span className="hidden sm:inline-flex text-xs text-zinc-400 dark:text-zinc-500 font-mono">
            FastAPI Pipeline
          </span>
        </div>

        {/* Tab 1: Overview (All Sections) */}
        {activeTab === "all" && (
          <div className="space-y-8 animate-fadeIn">
            {/* 1. Summary & Key Metrics */}
            <SummaryCard />

            {/* 2. Insights Grid: Action Items, Key Decisions, Open Questions */}
            <InsightsGrid />

            {/* 3. Side-by-side or stacked: Transcript & Chat */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                <TranscriptViewer />
              </div>
              <div className="lg:col-span-5 sticky top-36">
                <ChatPanel />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Insights Only */}
        {activeTab === "insights" && (
          <div className="space-y-6 animate-fadeIn">
            <SummaryCard />
            <InsightsGrid />
          </div>
        )}

        {/* Tab 3: Transcript Only */}
        {activeTab === "transcript" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <TranscriptViewer />
          </div>
        )}

        {/* Tab 4: Chat Only */}
        {activeTab === "chat" && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <ChatPanel />
          </div>
        )}
      </div>
    </div>
  );
}
