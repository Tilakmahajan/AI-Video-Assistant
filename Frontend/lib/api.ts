import { AnalyzeRequest, AnalyzeResponse, ChatResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Check if the backend API is reachable.
 */
export async function checkApiHealth(): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/`, {
      method: "GET",
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: true, message: data.message || "API is active" };
    }
    return { ok: false, message: `API returned HTTP ${res.status}` };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Network error";
    return {
      ok: false,
      message: `Cannot connect to API at ${API_BASE_URL}: ${errorMessage}`,
    };
  }
}

/**
 * Analyze a video from a YouTube URL or file source.
 * Calls POST /api/analyze
 */
export async function analyzeVideo(
  source: string,
  language: string = "english"
): Promise<AnalyzeResponse> {
  const payload: AnalyzeRequest = {
    source: source.trim(),
    language: language.trim() || "english",
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorDetail = `Backend returned status ${response.status} (${response.statusText})`;
      try {
        const errorJson = await response.json();
        if (errorJson.detail) {
          errorDetail = typeof errorJson.detail === "string" ? errorJson.detail : JSON.stringify(errorJson.detail);
        } else if (errorJson.message) {
          errorDetail = errorJson.message;
        }
      } catch {
        // Fallback to text if not JSON
        const rawText = await response.text().catch(() => "");
        if (rawText) errorDetail = rawText.slice(0, 200);
      }

      throw new ApiError(errorDetail, response.status);
    }

    const data: AnalyzeResponse = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to connect to the backend server.";

    if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
      throw new ApiError(
        `Cannot connect to backend server at ${API_BASE_URL}. Ensure the FastAPI server is running with 'uvicorn api:app --reload'.`,
        0
      );
    }

    throw new ApiError(message);
  }
}

/**
 * Ask a question about the video transcript using RAG.
 * Prepared for POST /api/chat
 */
export async function askQuestion(
  question: string,
  context?: string
): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question.trim(),
        context: context || "",
      }),
    });

    if (response.status === 404) {
      throw new ApiError(
        "The chat endpoint (POST /api/chat) is not yet active on the backend server. Once enabled on FastAPI, responses will appear here.",
        404
      );
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new ApiError(
        `Chat service returned error (${response.status}): ${errText || response.statusText}`,
        response.status
      );
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to connect to the chat service.";

    if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
      throw new ApiError(
        `Cannot reach chat service at ${API_BASE_URL}. Ensure the FastAPI server is running.`,
        0
      );
    }

    throw new ApiError(message);
  }
}
