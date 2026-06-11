from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from services.whisper_stt import transcribe
from services.llm_handler import ask_claude, save_memory
from services.tts_handler import speak
import shutil
import os

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")

class MemoryUpdate(BaseModel):
    username: str
    note: str

@router.post("/memory")
async def update_memory(data: MemoryUpdate):
    save_memory(data.username, data.note)
    return {"message": "Memory updated"}

@router.post("/ask")
async def ask(audio: UploadFile = File(...)):
    try:
        os.makedirs(STATIC_DIR, exist_ok=True)

        audio_path = os.path.join(STATIC_DIR, "temp_question.wav")

        with open(audio_path, "wb") as f:
            shutil.copyfileobj(audio.file, f)

        stt = transcribe(audio_path)
        question = stt["text"].strip()
        language = stt["language"]

        if not question:
            raise HTTPException(status_code=400, detail="Could not understand audio.")

        answer = ask_claude(question, language)
        audio_url = speak(answer, language)

        return {
            "question": question,
            "answer": answer,
            "language": language,
            "audio_url": audio_url
        }

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"FULL ERROR:\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))