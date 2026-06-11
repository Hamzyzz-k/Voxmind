import requests
from ddgs import DDGS
from datetime import datetime

LANG_MAP = {
    "hi": "Hindi",
    "ta": "Tamil",
    "fr": "French",
    "es": "Spanish",
    "en": "English",
    "kn": "Kannada"
}

def search_web(query: str) -> str:
    try:
        results = DDGS().text(query, max_results=3)
        if results:
            return "\n".join([r["body"] for r in results])
    except:
        pass
    return ""

def needs_search(question: str) -> bool:
    keywords = ["today", "current", "latest", "now", "recent",
                "news", "price", "weather", "score", "date", 
                "2024", "2025", "2026", "who is", "when did", 
                "happened", "result"]
    return any(k in question.lower() for k in keywords)
def ask_claude(question: str, language: str, username: str = "") -> str:
    lang_name = LANG_MAP.get(language, "English")
    lang_hint = f"Reply in {lang_name}." if language != "en" else ""

    today = datetime.now().strftime("%A, %B %d, %Y")
    
    memory = load_memory(username) if username else ""
    memory_context = f"About the user: {memory}\n" if memory else ""

    context = f"Today's date is {today}.\n{memory_context}"
    
    if needs_search(question):
        web_results = search_web(question)
        if web_results:
            context += f"Web search results:\n{web_results}\n"

    prompt = f"{lang_hint} {context}\nAnswer this question: {question}".strip()

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3.2",
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )
        return response.json()["response"]
    except Exception as e:
        raise Exception(f"Ollama error: {str(e)}")
        import json
import os

MEMORY_FILE = "voice_profiles/user_memory.json"

def load_memory(username: str) -> str:
    if not os.path.exists(MEMORY_FILE):
        return ""
    with open(MEMORY_FILE, "r") as f:
        data = json.load(f)
    return data.get(username, "")

def save_memory(username: str, note: str):
    data = {}
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, "r") as f:
            data = json.load(f)
    data[username] = note
    with open(MEMORY_FILE, "w") as f:
        json.dump(data, f)