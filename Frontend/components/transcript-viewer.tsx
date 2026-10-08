"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Copy,
  Check,
  Download,
  FileText,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useAnalysis } from "./analysis-context";

export function TranscriptViewer() {
  const { data } = useAnalysis();
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const rawTranscript = data?.transcript || "";

  const handleCopy = async () => {
    if (!rawTranscript) return;
    await navigator.clipboard.writeText(rawTranscript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!rawTranscript) return;
    const blob = new Blob([rawTranscript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(data?.title || "transcript").replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Split transcript into structured paragraphs / dialogue segments
  const paragraphs = useMemo(() => {
    if (!rawTranscript) return [];
    return rawTranscript
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
  }, [rawTranscript]);

  // Count search query matches
  const matchCount = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query || !rawTranscript) return 0;
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const matches = rawTranscript.match(regex);
    return matches ? matches.length : 0;
  }, [searchQuery, rawTranscript]);

  // Helper to render text with highlighted search query
  const renderHighlightedText = (text: string) => {
    const query = searchQuery.trim();
    if (!query) return text;

    try {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const parts = text.split(new RegExp(`(${escaped})`, "gi"));
      return (
        <>
          {parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
              <mark key={i} className="transcript-highlight">
                {part}
              </mark>
            ) : (
              part
            )
          )}
        </>
      );
    } catch {
      return text;
    }
  };

  if (!rawTranscript) return null;

  return (
    <div
      className={`rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/70 shadow-2xs transition-all flex flex-col ${
        isExpanded ? "fixed inset-4 sm:inset-10 z-50 shadow-2xl" : "relative"
      }`}
    >
      {/* Header Toolbar */}
      <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left Title & Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200/40 dark:border-blue-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Full Transcript
            </h2>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
              {paragraphs.length} paragraphs • {rawTranscript.split(/\s+/).length} words
            </span>
          </div>
        </div>

        {/* Right Toolbar: Search & Action buttons */}
        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transcript..."
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {searchQuery && (
            <span className="text-[11px] font-mono px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shrink-0">
              {matchCount} {matchCount === 1 ? "match" : "matches"}
            </span>
          )}

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors shrink-0"
            title="Copy entire transcript"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors shrink-0"
            title="Download transcript as .txt"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Expand / Minimize toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors shrink-0"
            title={isExpanded ? "Collapse viewer" : "Expand full screen"}
            aria-label={isExpanded ? "Collapse viewer" : "Expand full screen"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Transcript Scrollable Area */}
      <div
        className={`p-5 sm:p-7 overflow-y-auto font-sans leading-relaxed text-sm text-zinc-800 dark:text-zinc-200 divide-y divide-zinc-100/80 dark:divide-zinc-800/60 ${
          isExpanded ? "flex-1 max-h-none" : "max-h-[460px]"
        }`}
      >
        {paragraphs.map((paragraph, index) => {
          // Check if paragraph contains timestamp header like [00:00] or Tilak:
          const matchTimestamp = paragraph.match(/^(\[\d{1,2}:\d{2}\])\s*(.*)/);

          if (matchTimestamp) {
            const timestamp = matchTimestamp[1];
            const content = matchTimestamp[2];
            return (
              <div key={index} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                    {timestamp}
                  </span>
                  <div className="flex-1">
                    {renderHighlightedText(content)}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={index} className="py-3 first:pt-0 last:pb-0">
              <p>{renderHighlightedText(paragraph)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
