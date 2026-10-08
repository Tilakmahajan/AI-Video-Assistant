"use client";

import React from "react";
import {
  FileText,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Zap,
} from "lucide-react";
import { VideoInput } from "./video-input";

export function Hero() {
  const features = [
    {
      icon: FileText,
      title: "AI Transcription",
      description: "Fast, accurate speech-to-text with Whisper ASR chunking and 16kHz downsampling.",
    },
    {
      icon: Sparkles,
      title: "Smart Summary",
      description: "Structured executive briefs with clear takeaways powered by Gemini 3.8 Flash.",
    },
    {
      icon: CheckCircle2,
      title: "Key Insights",
      description: "Automatic extraction of action items, owners, deadlines, decisions & questions.",
    },
    {
      icon: MessageSquare,
      title: "Ask Anything",
      description: "RAG vector retrieval to query any timestamp, fact, or detail in the video.",
    },
  ];

  return (
    <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Top subtle badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-6 shadow-2xs">
        <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
        <span>RAG-Powered Video & Audio Intelligence</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-zinc-950 dark:text-white max-w-3xl leading-[1.12]">
        Turn Any Video Into{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 dark:from-indigo-400 dark:via-indigo-300 dark:to-violet-400">
          Knowledge
        </span>
      </h1>

      {/* Supporting Text */}
      <p className="mt-5 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
        Transcribe, summarize, extract insights, and chat with your videos using AI.
      </p>

      {/* Main Input Component */}
      <div className="w-full mt-10 mb-16">
        <VideoInput />
      </div>

      {/* Feature Highlights Grid */}
      <div className="w-full max-w-5xl">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-6">
          Everything you need from your video in seconds
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="group p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:-translate-y-0.5 shadow-2xs"
              >
                <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center mb-3.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  {feat.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
