
import os
import logging
from contextlib import asynccontextmanager
from threading import Lock
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from utils.audio_processer import process_input
from core.transcriber import transcribe_all
from core.summarizer import summarize, generate_title
from core.extractor import (
    extract_action_items,
    extract_key_decisions,
    extract_questions,
)
from core.rag_engine import build_rag_chain, ask_question

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage for RAG chains.
# Note: data is lost when the service restarts and isn't shared across instances.
rag_sessions = {}
rag_lock = Lock()


# --------------------------------------------------
# Existing AI pipeline
# --------------------------------------------------

def run_pipeline(source: str, language: str = "english") -> dict:
    logger.info("Starting AI Video Assistant pipeline")

    chunks = process_input(source)
    transcript = transcribe_all(chunks, language)

    title = generate_title(transcript)
    summary = summarize(transcript)
    action_items = extract_action_items(transcript)
    decisions = extract_key_decisions(transcript)
    questions = extract_questions(transcript)

    rag_chain = build_rag_chain(transcript)

    return {
        "title": title,
        "transcript": transcript,
        "summary": summary,
        "action_items": action_items,
        "key_decisions": decisions,
        "open_questions": questions,
        "rag_chain": rag_chain,
    }


# --------------------------------------------------
# Request / response models
# --------------------------------------------------

class ProcessRequest(BaseModel):
    source: str = Field(min_length=1, max_length=2048)
    language: str = "english"


class ProcessResponse(BaseModel):
    session_id: str
    title: str
    transcript: str
    summary: str
    action_items: str
    key_decisions: str
    open_questions: str


class ChatRequest(BaseModel):
    session_id: str
    question: str = Field(min_length=1, max_length=5000)


# --------------------------------------------------
# FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="AI Video Assistant API",
    description=(
        "Process YouTube videos or supported media sources, "
        "generate summaries, and ask questions about the transcript."
    ),
    version="1.0.0",
)

# Set FRONTEND_URL in Render to your deployed Next.js origin,
# e.g. https://your-frontend.vercel.app
frontend_origin = os.getenv("FRONTEND_URL")

allowed_origins = [
    origin.strip().rstrip("/")
    for origin in (frontend_origin or "").split(",")
    if origin.strip()
]

# Optional local development origin.
allowed_origins.append("http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set(allowed_origins)),
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "AI Video Assistant API is running",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "ok"}


# --------------------------------------------------
# Process video / audio source
# --------------------------------------------------

@app.post("/process", response_model=ProcessResponse)
def process_video(request: ProcessRequest):
    source = request.source.strip()
    language = request.language.strip().lower() or "english"

    if not source:
        raise HTTPException(
            status_code=400,
            detail="Source URL or file path cannot be empty.",
        )

    if language not in {"english", "hinglish"}:
        raise HTTPException(
            status_code=400,
            detail="Language must be 'english' or 'hinglish'.",
        )

    try:
        result = run_pipeline(source, language)

        # Keep the RAG chain server-side; it cannot be sent as JSON.
        session_id = str(uuid4())

        with rag_lock:
            rag_sessions[session_id] = result["rag_chain"]

        return ProcessResponse(
            session_id=session_id,
            title=str(result["title"]),
            transcript=str(result["transcript"]),
            summary=str(result["summary"]),
            action_items=str(result["action_items"]),
            key_decisions=str(result["key_decisions"]),
            open_questions=str(result["open_questions"]),
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Video processing failed")
        raise HTTPException(
            status_code=500,
            detail="Video processing failed. Check backend logs.",
        ) from exc


# --------------------------------------------------
# Chat with processed transcript (RAG)
# --------------------------------------------------

@app.post("/chat")
def chat_with_video(request: ChatRequest):
    session_id = request.session_id.strip()
    question = request.question.strip()

    if not session_id:
        raise HTTPException(
            status_code=400,
            detail="Session ID is required.",
        )

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty.",
        )

    with rag_lock:
        rag_chain = rag_sessions.get(session_id)

    if rag_chain is None:
        raise HTTPException(
            status_code=404,
            detail=(
                "Session not found. Process the video again; "
                "the session may have expired after a service restart."
            ),
        )

    try:
        answer = ask_question(rag_chain, question)
        return {
            "session_id": session_id,
            "question": question,
            "answer": str(answer),
        }

    except Exception as exc:
        logger.exception("RAG chat failed")
        raise HTTPException(
            status_code=500,
            detail="Could not answer the question. Check backend logs.",
        ) from exc
