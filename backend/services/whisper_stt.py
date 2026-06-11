import speech_recognition as sr
import subprocess
import imageio_ffmpeg
import os

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

def convert_to_proper_wav(input_path: str, output_path: str):
    cmd = [
        ffmpeg, "-y",
        "-i", input_path,
        "-ar", "16000",
        "-ac", "1",
        "-sample_fmt", "s16",
        output_path
    ]
    subprocess.run(cmd, capture_output=True)

def transcribe(audio_path: str) -> dict:
    converted_path = audio_path.replace(".wav", "_converted.wav")
    convert_to_proper_wav(audio_path, converted_path)
    
    recognizer = sr.Recognizer()
    with sr.AudioFile(converted_path) as source:
        audio = recognizer.record(source)
    try:
        text = recognizer.recognize_google(audio)
        return {"text": text, "language": "en"}
    except sr.UnknownValueError:
        return {"text": "", "language": "en"}
    except sr.RequestError as e:
        raise Exception(f"Speech recognition error: {e}")