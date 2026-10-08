# 🎥 AI Video Assistant

> An AI-powered platform that transforms YouTube videos into structured knowledge and lets you interact with the content using AI.

**AI Video Assistant** processes YouTube videos, converts speech into text using Whisper, analyzes the transcript using Gemini, and provides summaries, action items, key decisions, open questions, and an interactive RAG-powered chat experience.

---

## ✨ Features

### 🎬 Video Processing
- Accept YouTube video URLs.
- Download audio using `yt-dlp`.
- Automatically process and chunk audio.

### 📝 AI Transcription
- Speech-to-text using OpenAI Whisper.
- Supports English and Hinglish transcription.
- Handles longer audio by processing multiple chunks.

### 🤖 AI Analysis

The application extracts useful information from the transcript:

- 📌 AI-generated title
- 📋 Summary
- ✅ Action items
- 🔑 Key decisions
- ❓ Open questions

### 💬 AI Video Chat

Ask questions about the processed video using a **Retrieval-Augmented Generation (RAG)** pipeline.

Example questions:

```text
What is this video about?

What are the main points?

What decisions were made?

What action items were mentioned?

What are the unresolved questions?

Explain the important part of the video.
```

### ⚡ FastAPI Backend

The Python AI pipeline is exposed through a REST API using FastAPI.

### 💻 Modern Web Interface

The frontend is built with:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

---

# 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │     Next.js UI      │
                         │ React + TypeScript  │
                         │   Tailwind CSS      │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP
                                    ▼
                         ┌─────────────────────┐
                         │   FastAPI Backend   │
                         │      Python         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │   AI Processing Layer   │
                       └────────────┬────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              ▼                     ▼                     ▼
        ┌───────────┐         ┌───────────┐        ┌───────────┐
        │  yt-dlp   │         │  Whisper  │        │  Gemini   │
        │           │         │           │        │           │
        │   Audio   │         │Transcript │        │  Analysis │
        └───────────┘         └─────┬─────┘        └───────────┘
                                    │
                                    ▼
                             ┌─────────────┐
                             │ RAG Engine  │
                             └──────┬──────┘
                                    │
                                    ▼
                              💬 AI Chat
```

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| Next.js | Frontend framework |
| React | UI development |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Lucide | Icons |

## Backend

| Technology | Purpose |
|---|---|
| Python | Core application |
| FastAPI | REST API |
| LangChain | LLM/RAG orchestration |
| yt-dlp | YouTube audio extraction |
| Pydub | Audio processing |
| FFmpeg | Audio conversion |

## AI / ML

| Technology | Purpose |
|---|---|
| OpenAI Whisper | Speech-to-text |
| Google Gemini | Transcript analysis |
| Embeddings | Semantic representation |
| Vector Store | Similarity search |
| RAG | Context-aware question answering |

---

# 📂 Project Structure

```text
AI Video Agent/
│
├── Backend/
│   │
│   ├── core/
│   │   ├── extractor.py
│   │   ├── rag_engine.py
│   │   ├── summarizer.py
│   │   ├── transcriber.py
│   │   └── vector_store.py
│   │
│   ├── utils/
│   │   └── audio_processer.py
│   │
│   ├── api.py
│   ├── main.py
│   ├── test.py
│   ├── requirements.txt
│   └── .gitignore
│
├── Frontend/
│   │
│   ├── app/
│   │   ├── analysis/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── action-items.tsx
│   │   ├── analysis-context.tsx
│   │   ├── analysis-header.tsx
│   │   ├── chat-message.tsx
│   │   ├── chat-panel.tsx
│   │   ├── hero.tsx
│   │   ├── insight-card.tsx
│   │   ├── key-decisions.tsx
│   │   ├── loading-state.tsx
│   │   ├── navbar.tsx
│   │   ├── open-questions.tsx
│   │   ├── summary-card.tsx
│   │   ├── transcript-viewer.tsx
│   │   └── upload-zone.tsx
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
└── .gitignore
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

- Python 3.11+
- Node.js
- npm
- FFmpeg
- Git

---

# 🔧 Backend Setup

Navigate to the backend:

```bash
cd Backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 🔐 Environment Variables

Create a `.env` file inside `Backend/`:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Never commit your `.env` file.

---

# ▶️ Run the Backend

### Run the AI pipeline

```bash
python main.py
```

You can provide:

```text
YouTube URL
```

and choose:

```text
english
```

or:

```text
hinglish
```

---

# ⚡ Run FastAPI

From the `Backend` directory:

```bash
uvicorn api:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

Open another terminal and navigate to:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env.local
```

with:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🔌 API

## Health Check

```http
GET /
```

Response:

```json
{
  "message": "AI Video Assistant API is running"
}
```

---

## Analyze Video

```http
POST /api/analyze
```

Request:

```json
{
  "source": "https://www.youtube.com/watch?v=example",
  "language": "english"
}
```

The backend processes the video and returns structured analysis.

Example response:

```json
{
  "title": "Example Video",
  "transcript": "...",
  "summary": "...",
  "action_items": "...",
  "key_decisions": "...",
  "open_questions": "..."
}
```

---

# 🧠 How It Works

### 1. User Provides a Video

The user enters a YouTube URL through the web interface.

```text
YouTube URL
      ↓
Frontend
```

### 2. Backend Receives the Request

Next.js sends the request to the FastAPI backend.

```text
Frontend
   ↓
FastAPI
```

### 3. Audio Extraction

`yt-dlp` downloads the audio from the YouTube video.

```text
YouTube Video
      ↓
    yt-dlp
      ↓
     Audio
```

### 4. Audio Processing

The audio is divided into manageable chunks.

```text
Audio
  ↓
Chunk 1
Chunk 2
Chunk 3
...
```

### 5. Transcription

Whisper converts each audio chunk into text.

```text
Audio
  ↓
Whisper
  ↓
Transcript
```

### 6. AI Analysis

Gemini analyzes the transcript and generates:

```text
Title
Summary
Action Items
Key Decisions
Open Questions
```

### 7. RAG Pipeline

The transcript is processed and stored for semantic retrieval.

```text
Transcript
    ↓
Embeddings
    ↓
Vector Store
    ↓
Similarity Search
```

### 8. AI Chat

When the user asks a question:

```text
User Question
      ↓
Retriever
      ↓
Relevant Transcript Chunks
      ↓
Gemini
      ↓
AI Answer
```

---

# 💬 RAG Chat

The RAG system allows users to interact with the video instead of manually searching through a long transcript.

For example:

> "What was the main lesson of the video?"

The system retrieves the relevant transcript context and generates an answer based on the video content.

This helps reduce hallucinations and keeps responses grounded in the processed content.

---

# ⚠️ Limitations

- Whisper transcription can be slow on CPU-only machines.
- Processing time increases with video length.
- Gemini API usage is subject to quota and rate limits.
- YouTube extraction may require a supported JavaScript runtime depending on `yt-dlp`.
- Very long videos require more processing resources.
- GPU acceleration can significantly improve Whisper performance.

---

# 🔐 Security

Do not commit sensitive information such as:

```text
.env
API keys
credentials
tokens
```

The Gemini API key should remain in the backend environment.

The frontend should communicate with the backend through the API rather than exposing the Gemini key.

---

# 🔮 Future Improvements

- [ ] User authentication
- [ ] Video processing progress indicator
- [ ] Background processing for long videos
- [ ] Persistent video history
- [ ] Timestamp-based transcript navigation
- [ ] Speaker identification
- [ ] Multiple language support
- [ ] Export summaries as PDF
- [ ] Download transcripts
- [ ] Improved RAG retrieval
- [ ] Conversation history
- [ ] Streaming AI responses
- [ ] Cloud deployment
- [ ] GPU-based Whisper processing
- [ ] Support for uploaded video files
- [ ] Multiple AI model providers

---

# 🎯 What I Learned From This Project

This project helped implement several practical AI concepts:

```text
Python
   ↓
Speech-to-Text
   ↓
Prompt Engineering
   ↓
LLM APIs
   ↓
LangChain
   ↓
Embeddings
   ↓
Vector Databases
   ↓
RAG
   ↓
FastAPI
   ↓
Next.js
   ↓
Full-Stack AI Application
```

It demonstrates how individual AI components can be combined into a complete end-to-end application.

---

# 👨‍💻 Author

## Tilak Mahajan

B.E. Computer Science & Engineering

### Interests

- Full Stack Development
- Artificial Intelligence
- Generative AI
- Agentic AI
- Machine Learning
- RAG Systems
- AI Application Development

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📌 Project Status

**Status: Active Development 🚀**

The core AI pipeline, FastAPI backend, RAG functionality, and Next.js frontend are implemented. Further improvements are planned around performance, deployment, persistence, and scalability.
