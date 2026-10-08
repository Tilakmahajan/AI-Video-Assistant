"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import {
  MessageSquare,
  Send,
  Loader2,
  Sparkles,
  Trash2,
  Bot,
  CornerDownLeft,
} from "lucide-react";
import { useAnalysis } from "./analysis-context";
import { ChatMessage } from "./chat-message";

const SUGGESTED_QUESTIONS = [
  "What is the main idea?",
  "Summarize the most important points",
  "What decisions were made?",
  "What should I remember from this video?",
];

export function ChatPanel() {
  const { chatMessages, sendChatMessage, isChatLoading, clearChat, data } =
    useAnalysis();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);

  const handleSend = async (text?: string) => {
    const question = text || inputValue;
    if (!question.trim() || isChatLoading) return;

    setInputValue("");
    await sendChatMessage(question.trim());

    // Focus back on textarea after sending
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/70 shadow-2xs flex flex-col h-[600px] overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span>Chat with your video</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                RAG Engine
              </span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Ask questions about the content of this video.
            </p>
          </div>
        </div>

        {chatMessages.length > 0 && (
          <button
            type="button"
            onClick={clearChat}
            disabled={isChatLoading}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
            title="Clear conversation"
            aria-label="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {chatMessages.length === 0 ? (
          /* Empty Chat State with Suggested Questions */
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-3.5">
              <Bot className="w-6 h-6 text-indigo-500/80" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              Ask anything about this video
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
              Gemini searches relevant transcript segments using FAISS vector similarity to provide accurate answers.
            </p>

            {/* Suggested Question Chips */}
            <div className="w-full max-w-md space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Suggested questions:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-1">
                {SUGGESTED_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSend(question)}
                    disabled={isChatLoading}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-700 bg-zinc-50/70 dark:bg-zinc-900/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 text-xs text-zinc-700 dark:text-zinc-300 text-left transition-all hover:scale-[1.01] flex items-center justify-between group disabled:opacity-50"
                  >
                    <span>{question}</span>
                    <Sparkles className="w-3 h-3 text-zinc-400 group-hover:text-indigo-500 shrink-0 ml-1.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Message List */
          <div className="space-y-4">
            {chatMessages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Typing / Loading indicator */}
            {isChatLoading && (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-none bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                  <span>Searching transcript & reasoning...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Form at Bottom */}
      <div className="p-3 sm:p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center gap-2"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isChatLoading}
            placeholder="Ask anything about this video..."
            className="w-full resize-none pl-3.5 pr-20 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50"
          />

          <div className="absolute right-2 flex items-center gap-1">
            <span className="hidden sm:inline text-[10px] text-zinc-400 font-mono">
              ↵ Enter
            </span>
            <button
              type="submit"
              disabled={!inputValue.trim() || isChatLoading}
              aria-label="Send message"
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              {isChatLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </form>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1.5 text-center">
          Shift + Enter for new line • Grounded directly in video transcript
        </p>
      </div>
    </div>
  );
}
