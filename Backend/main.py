import sys

from dotenv import load_dotenv

from utils.audio_processer import process_input
from core.transcriber import transcribe_all
from core.summarizer import summarize, generate_title
from core.extractor import extract_action_items, extract_key_decisions, extract_questions
from core.rag_engine import build_rag_chain, ask_question


load_dotenv()


def read_source_and_language():
    args = sys.argv[1:]
    if args:
        source = args[0].strip()
        language = (args[1] if len(args) > 1 else "english").strip() or "english"
        return source, language

    if not sys.stdin.isatty():
        raise SystemExit(
            "No input provided. Run: python main.py '<YouTube URL or local file path>' [english|hinglish]"
        )

    try:
        source = input("Enter YouTube URL or local file path: ").strip()
    except EOFError:
        raise SystemExit(
            "No input provided. Run: python main.py '<YouTube URL or local file path>' [english|hinglish]"
        )

    try:
        language = input("Language (english/hinglish): ").strip() or "english"
    except EOFError:
        language = "english"

    return source, language


def run_pipeline(source: str, language: str = "english") -> dict:
    print("starting AI Video Assistant")

    chunks = process_input(source)

    transcript = transcribe_all(chunks, language)
    print(f"raw transcription (first 300 characters ) {transcript[:300]}")

    title = generate_title(transcript)

    summary = summarize(transcript)

    action_item = extract_action_items(transcript)

    decisions = extract_key_decisions(transcript)
    questions = extract_questions(transcript)

    rag_chain = build_rag_chain(transcript)

    return {
        "title": title,
        "transcript": transcript,
        "summary": summary,
        "action_items": action_item,
        "key_decisions": decisions,
        "open_questions": questions,
        "rag_chain": rag_chain,
    }


if __name__ == "__main__":
    source, language = read_source_and_language()
    if not source:
        raise SystemExit("Source URL/path cannot be empty.")

    result = run_pipeline(source, language)

    print("\n" + "=" * 60)
    print(f"📌 Title: {result['title']}")
    print(f"\n📋 Summary:\n{result['summary']}")
    print(f"\n✅ Action Items:\n{result['action_items']}")
    print(f"\n🔑 Key Decisions:\n{result['key_decisions']}")
    print(f"\n❓ Open Questions:\n{result['open_questions']}")
    print("=" * 60)

    # Phase 2 — Chat with your meeting via RAG
    print("\n💬 Chat with your meeting (type 'exit' to quit)\n")
    rag_chain = result["rag_chain"]
    while True:
        try:
            question = input("You: ").strip()
        except EOFError:
            print("\n👋 Goodbye!")
            break

        if question.lower() in ["exit", "quit", "q"]:
            print("👋 Goodbye!")
            break
        if not question:
            continue
        answer = ask_question(rag_chain, question)
        print(f"\n🤖 Assistant: {answer}\n")