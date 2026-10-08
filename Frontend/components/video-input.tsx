"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileVideo,
  ArrowRight,
  Loader2,
  Sparkles,
  Globe,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { YoutubeIcon } from "./brand-icons";
import { UploadZone } from "./upload-zone";
import { useAnalysis } from "./analysis-context";

export function VideoInput() {
  const router = useRouter();
  const { startAnalysis, status, errorMessage, loadSampleAnalysis } = useAnalysis();

  const [inputMode, setInputMode] = useState<"youtube" | "file">("youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<string>("english");
  const [validationError, setValidationError] = useState<string | null>(null);

  const isProcessing = status === "processing";

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    let targetSource = "";

    if (inputMode === "youtube") {
      const trimmed = youtubeUrl.trim();
      if (!trimmed) {
        setValidationError("Please enter a valid YouTube video URL.");
        return;
      }
      if (!trimmed.includes("youtube.com") && !trimmed.includes("youtu.be")) {
        setValidationError("Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=...)");
        return;
      }
      targetSource = trimmed;
    } else {
      if (!selectedFile) {
        setValidationError("Please select or drop an audio/video file to analyze.");
        return;
      }
      // For local file, we pass the file name or path to the backend
      targetSource = selectedFile.name;
    }

    const success = await startAnalysis(targetSource, language);
    if (success) {
      router.push("/analysis");
    }
  };

  const handleSampleClick = () => {
    loadSampleAnalysis();
    router.push("/analysis");
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Container card */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 shadow-xl shadow-zinc-200/40 dark:shadow-black/40 backdrop-blur-sm p-4 sm:p-7 transition-all">
        {/* Input Mode Selector Tabs */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-5">
          <div className="flex items-center p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setInputMode("youtube");
                setValidationError(null);
              }}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                inputMode === "youtube"
                  ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              <YoutubeIcon className="w-3.5 h-3.5 text-red-500" />
              <span>YouTube Video</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setInputMode("file");
                setValidationError(null);
              }}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                inputMode === "file"
                  ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              <FileVideo className="w-3.5 h-3.5 text-indigo-500" />
              <span>Local File Upload</span>
            </button>
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <Globe className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isProcessing}
              aria-label="Transcription Language"
              className="bg-transparent text-zinc-600 dark:text-zinc-300 font-medium text-xs focus:outline-none cursor-pointer py-1 pr-1 border-0"
            >
              <option value="english" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                English
              </option>
              <option value="hinglish" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                Hinglish
              </option>
            </select>
          </div>
        </div>

        {/* Input form */}
        <form onSubmit={handleAnalyze} className="space-y-4">
          {inputMode === "youtube" ? (
            <div className="space-y-2">
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none">
                  <YoutubeIcon className="w-5 h-5 text-red-500/80" />
                </div>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  disabled={isProcessing}
                  placeholder="Paste YouTube URL (e.g. https://www.youtube.com/watch?v=...)"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all disabled:opacity-60"
                />
              </div>
            </div>
          ) : (
            <UploadZone
              onFileSelect={(file) => {
                setSelectedFile(file);
                if (validationError) setValidationError(null);
              }}
              selectedFile={selectedFile}
              onClearFile={() => setSelectedFile(null)}
              disabled={isProcessing}
            />
          )}

          {/* Validation or API error alert */}
          {(validationError || errorMessage) && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg text-xs bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <div className="flex-1">
                <p className="font-medium">{validationError || errorMessage}</p>
                {errorMessage && errorMessage.includes("Cannot connect") && (
                  <p className="mt-1 text-red-600 dark:text-red-400 font-mono text-[11px]">
                    Tip: Start backend with: uvicorn api:app --reload
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Whisper ASR + Gemini 3.8 Flash extraction</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSampleClick}
                disabled={isProcessing}
                className="w-full sm:w-auto px-3.5 py-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors disabled:opacity-50"
              >
                Try sample video
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-medium text-sm transition-all shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400 dark:text-indigo-600" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze Video</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
