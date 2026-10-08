"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  AnalyzeResponse,
  ChatMessage,
  ProcessingStatus,
  ParsedActionItem,
} from "@/lib/types";
import { analyzeVideo, askQuestion, ApiError } from "@/lib/api";

interface AnalysisContextType {
  data: AnalyzeResponse | null;
  source: string;
  language: string;
  status: ProcessingStatus;
  currentStepIndex: number;
  errorMessage: string | null;
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  completedTasks: Record<string, boolean>;
  toggleTaskCompleted: (id: string) => void;
  startAnalysis: (sourceInput: string, lang?: string) => Promise<boolean>;
  sendChatMessage: (question: string) => Promise<void>;
  resetAnalysis: () => void;
  loadSampleAnalysis: () => void;
  clearChat: () => void;
  parsedActionItems: ParsedActionItem[];
  parsedDecisions: string[];
  parsedQuestions: string[];
}

const STORAGE_KEY = "aivideo_analysis_data";
const STORAGE_SOURCE_KEY = "aivideo_analysis_source";

const DEMO_ANALYSIS: AnalyzeResponse = {
  title: "Q3 Product Architecture & Gemini 1.5/3.8 Pipeline Sync",
  transcript: `[00:00] Tilak: Hey everyone, welcome to the engineering architecture sync for Q3. Today we're reviewing the migration of our audio processing pipeline and RAG agent architecture.
[00:28] Sarah: Thanks Tilak. To recap, our current Whisper processing latency was around 45 seconds for a 10-minute video. With the new chunking and 16kHz downsampling in pydub, we've reduced that to under 12 seconds.
[01:15] Alex: That's a huge improvement. What about memory overhead during long YouTube stream ingestion?
[01:42] Tilak: yt-dlp now extracts audio directly into 192kbps WAV files without downloading full 1080p video streams, cutting disk usage by 85%.
[02:10] Sarah: We also implemented LangChain's ChatGoogleGenerativeAI with Gemini 3.8 Flash for structured extraction. It extracts summary, action items, key decisions, and questions in parallel prompts.
[03:00] Alex: Great. I'll take responsibility for writing the integration tests for FastAPI by next Tuesday.
[03:45] Tilak: Perfect. Let's make sure we also decide on the vector store. Are we sticking with FAISS or ChromaDB?
[04:12] Sarah: We agreed to use FAISS for local offline vector search because it doesn't require any external database server running in docker.
[04:55] Alex: Agreed. One unresolved item: how should we handle rate limiting on Gemini API keys for heavy concurrent users?
[05:30] Tilak: Good question. Let's follow up with the infra team on setting up an exponential backoff retry handler next week.
[06:00] Sarah: Sounds like a plan. Wrapping up!`,
  summary:
    "The engineering team reviewed Q3 video pipeline optimizations. By chunking audio into 10-minute intervals and downsampling to 16kHz mono WAV format, Whisper transcription latency decreased from 45s to 12s. yt-dlp audio-only stream extraction reduced disk footprint by 85%. The team confirmed using FAISS for lightweight local vector retrieval and Gemini 3.8 Flash for parallel summarization and insight extraction. Next steps include backend integration tests and handling API rate limits.",
  action_items: `1. Task: Write integration tests for FastAPI endpoints
   Owner: Alex
   Deadline: Next Tuesday
2. Task: Implement exponential backoff retry handler for Gemini API rate limiting
   Owner: Tilak & Infra Team
   Deadline: Next Friday
3. Task: Validate FAISS vector index persistence across restarts
   Owner: Sarah
   Deadline: End of sprint`,
  key_decisions: `1. Standardized on yt-dlp audio-only extraction (192kbps WAV) to save 85% disk usage and network bandwidth.
2. Selected FAISS as the embedded local vector store to avoid external database overhead.
3. Upgraded reasoning engine to Gemini 3.8 Flash for high-throughput extraction and RAG queries.`,
  open_questions: `1. How will production rate limiting and quota management be handled for multi-tenant Gemini API usage?
2. Should we support Hinglish and multilingual Whisper translation models in the next release?`,
};

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [source, setSource] = useState<string>("");
  const [language, setLanguage] = useState<string>("english");
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Restore stored analysis on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      const storedSource = sessionStorage.getItem(STORAGE_SOURCE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AnalyzeResponse;
        setData(parsed);
        setStatus("success");
      }
      if (storedSource) {
        setSource(storedSource);
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  const toggleTaskCompleted = useCallback((id: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const resetAnalysis = useCallback(() => {
    setData(null);
    setSource("");
    setStatus("idle");
    setErrorMessage(null);
    setChatMessages([]);
    setCompletedTasks({});
    setCurrentStepIndex(0);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_SOURCE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  const loadSampleAnalysis = useCallback(() => {
    setData(DEMO_ANALYSIS);
    setSource("https://www.youtube.com/watch?v=sample-architecture-sync");
    setStatus("success");
    setErrorMessage(null);
    setCurrentStepIndex(3);
    setChatMessages([
      {
        id: "sample-1",
        role: "user",
        content: "What were the latency improvements mentioned?",
        timestamp: new Date(Date.now() - 60000),
      },
      {
        id: "sample-2",
        role: "assistant",
        content:
          "According to the meeting transcript, by chunking audio into 10-minute segments and downsampling to 16kHz mono WAV format, the Whisper transcription latency was reduced from 45 seconds down to under 12 seconds.",
        timestamp: new Date(Date.now() - 30000),
      },
    ]);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_ANALYSIS));
      sessionStorage.setItem(
        STORAGE_SOURCE_KEY,
        "https://www.youtube.com/watch?v=sample-architecture-sync"
      );
    } catch {
      // Ignore
    }
  }, []);

  const startAnalysis = useCallback(
    async (sourceInput: string, lang = "english"): Promise<boolean> => {
      if (!sourceInput.trim()) return false;

      setSource(sourceInput.trim());
      setLanguage(lang);
      setStatus("processing");
      setErrorMessage(null);
      setCurrentStepIndex(0);

      // Simulate realistic step progression while waiting for API
      let step = 0;
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        step = Math.min(step + 1, 2);
        setCurrentStepIndex(step);
      }, 3500);

      try {
        const result = await analyzeVideo(sourceInput.trim(), lang);
        if (timerRef.current) clearInterval(timerRef.current);

        setCurrentStepIndex(3);
        setData(result);
        setStatus("success");

        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
          sessionStorage.setItem(STORAGE_SOURCE_KEY, sourceInput.trim());
        } catch {
          // Ignore
        }
        return true;
      } catch (err: unknown) {
        if (timerRef.current) clearInterval(timerRef.current);
        setStatus("error");
        if (err instanceof ApiError) {
          setErrorMessage(err.message);
        } else if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("An unexpected error occurred while analyzing the video.");
        }
        return false;
      }
    },
    []
  );

  const sendChatMessage = useCallback(
    async (questionText: string) => {
      const trimmed = questionText.trim();
      if (!trimmed || isChatLoading) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, userMsg]);
      setIsChatLoading(true);

      try {
        const response = await askQuestion(trimmed, data?.transcript);
        const botMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.answer,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, botMsg]);
      } catch (err: unknown) {
        const errContent =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
            ? err.message
            : "Failed to generate answer. Please try again.";

        const systemErrorMsg: ChatMessage = {
          id: `system-${Date.now()}`,
          role: "system",
          content: errContent,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, systemErrorMsg]);
      } finally {
        setIsChatLoading(false);
      }
    },
    [data?.transcript, isChatLoading]
  );

  const clearChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  // Parse action items string into items
  const parsedActionItems = React.useMemo<ParsedActionItem[]>(() => {
    if (!data?.action_items) return [];
    const text = data.action_items.trim();
    if (
      text.toLowerCase().includes("no action items found") ||
      text.toLowerCase().includes("no action items detected")
    ) {
      return [];
    }

    // Split by numbered items e.g., "1.", "2." or markdown bullet points
    const lines = text.split("\n");
    const items: ParsedActionItem[] = [];
    interface TempTask {
      task: string;
      owner?: string;
      deadline?: string;
      raw: string;
    }
    let currentTask: TempTask | null = null;

    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Matches start of a new item: "1.", "1)", "- [ ]", or "1. Task:"
      const matchNumber = trimmed.match(/^(\d+[\.\)]|\-|\*)\s*(.*)/);
      if (matchNumber) {
        if (currentTask) {
          items.push({
            id: `item-${items.length}`,
            raw: currentTask.raw,
            task: currentTask.task,
            owner: currentTask.owner,
            deadline: currentTask.deadline,
          });
        }

        let content = matchNumber[2];
        const owner: string | undefined = undefined;
        const deadline: string | undefined = undefined;

        // Check if line contains "Task:" prefix
        if (content.toLowerCase().startsWith("task:")) {
          content = content.replace(/^task:\s*/i, "");
        }

        currentTask = {
          task: content,
          owner,
          deadline,
          raw: trimmed,
        };
      } else if (currentTask) {
        // Line might be details like "Owner: John", "Deadline: Friday"
        if (/^owner:\s*/i.test(trimmed)) {
          currentTask.owner = trimmed.replace(/^owner:\s*/i, "");
        } else if (/^deadline:\s*/i.test(trimmed)) {
          currentTask.deadline = trimmed.replace(/^deadline:\s*/i, "");
        } else {
          currentTask.task += ` ${trimmed}`;
        }
      } else {
        // Fallback single line
        items.push({
          id: `item-${index}`,
          raw: trimmed,
          task: trimmed.replace(/^[-*•]\s*/, ""),
        });
      }
    }

    if (currentTask !== null) {
      const finalTask: TempTask = currentTask;
      items.push({
        id: `item-${items.length}`,
        raw: finalTask.raw,
        task: finalTask.task,
        owner: finalTask.owner,
        deadline: finalTask.deadline,
      });
    }

    return items;
  }, [data?.action_items]);

  // Parse decisions
  const parsedDecisions = React.useMemo<string[]>(() => {
    if (!data?.key_decisions) return [];
    const text = data.key_decisions.trim();
    if (
      text.toLowerCase().includes("no key decisions found") ||
      text.toLowerCase().includes("no decisions found")
    ) {
      return [];
    }

    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.replace(/^(\d+[\.\)]|\-|\*)\s*/, ""));
  }, [data?.key_decisions]);

  // Parse questions
  const parsedQuestions = React.useMemo<string[]>(() => {
    if (!data?.open_questions) return [];
    const text = data.open_questions.trim();
    if (
      text.toLowerCase().includes("no open questions found") ||
      text.toLowerCase().includes("no questions found")
    ) {
      return [];
    }

    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.replace(/^(\d+[\.\)]|\-|\*)\s*/, ""));
  }, [data?.open_questions]);

  return (
    <AnalysisContext.Provider
      value={{
        data,
        source,
        language,
        status,
        currentStepIndex,
        errorMessage,
        chatMessages,
        isChatLoading,
        completedTasks,
        toggleTaskCompleted,
        startAnalysis,
        sendChatMessage,
        resetAnalysis,
        loadSampleAnalysis,
        clearChat,
        parsedActionItems,
        parsedDecisions,
        parsedQuestions,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}
