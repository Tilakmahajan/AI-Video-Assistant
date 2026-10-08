export interface AnalyzeRequest {
  source: string;
  language?: string;
}

export interface AnalyzeResponse {
  title: string;
  transcript: string;
  summary: string;
  action_items: string;
  key_decisions: string;
  open_questions: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  question: string;
  context?: string;
}

export interface ChatResponse {
  answer: string;
}

export type ProcessingStatus = "idle" | "uploading" | "processing" | "success" | "error";

export interface ProcessingStep {
  id: string;
  label: string;
  description?: string;
  status: "pending" | "current" | "completed";
}

export interface ParsedActionItem {
  id: string;
  raw: string;
  task: string;
  owner?: string;
  deadline?: string;
  completed?: boolean;
}
