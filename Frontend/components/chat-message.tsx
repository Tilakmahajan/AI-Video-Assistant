"use client";

import React, { useState } from "react";
import { Sparkles, User, Copy, Check, AlertCircle } from "lucide-react";
import { ChatMessage as ChatMessageType } from "@/lib/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.role === "system") {
    return (
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-800 dark:text-amber-200 text-xs">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
        <div className="flex-1 leading-relaxed">{message.content}</div>
      </div>
    );
  }

  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
          isUser
            ? "bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-950"
            : "bg-indigo-600 text-white shadow-xs"
        }`}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
      </div>

      {/* Message bubble */}
      <div
        className={`relative group max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
          isUser
            ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-tr-none font-medium"
            : "bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 text-zinc-900 dark:text-zinc-100 rounded-tl-none font-normal"
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>

        {!isUser && (
          <div className="mt-2.5 pt-2 border-t border-zinc-200/50 dark:border-zinc-700/50 flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500">
            <span>RAG Context Verified</span>
            <button
              type="button"
              onClick={handleCopy}
              className="hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors"
              title="Copy answer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
