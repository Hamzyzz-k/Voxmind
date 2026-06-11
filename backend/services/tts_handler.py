from gtts import gTTS
import os

LANG_MAP = {
    "en": "en",
    "hi": "hi",
    "ta": "ta",
    "fr": "fr",
    "es": "es"
}

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")

def speak(text: str, language: str) -> str:
    os.makedirs(STATIC_DIR, exist_ok=True)
    lang_code = LANG_MAP.get(language, "en")
    output_path = os.path.join(STATIC_DIR, "response.mp3")
    print(f"TTS saving to: {output_path}")
    tts = gTTS(text=text, lang=lang_code)
    tts.save(output_path)
    return "/static/response.mp3"