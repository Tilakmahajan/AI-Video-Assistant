from fastapi import FastAPI
from pydantic import BaseModel

from main import run_pipeline


app = FastAPI(
    title="AI Video Assistant API",
    description="API for the AI Video Assistant",
    version="1.0.0",
)


class AnalyzeRequest(BaseModel):
    source: str
    language: str = "english"


@app.get("/")
def root():
    return {
        "message": "AI Video Assistant API is running"
    }


@app.post("/api/analyze")
def analyze_video(request: AnalyzeRequest):
    result = run_pipeline(
        request.source,
        request.language
    )

    return {
        "title": result["title"],
        "transcript": result["transcript"],
        "summary": result["summary"],
        "action_items": result["action_items"],
        "key_decisions": result["key_decisions"],
        "open_questions": result["open_questions"],
    }