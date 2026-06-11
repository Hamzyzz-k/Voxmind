import requests
import sounddevice as sd
import soundfile as sf
import time
import os

os.makedirs("static", exist_ok=True)

print("Recording in 3 seconds...")
time.sleep(3)
print("SPEAK NOW!")

duration = 5
sample_rate = 16000
recording = sd.rec(
    int(duration * sample_rate),
    samplerate=sample_rate,
    channels=1,
    dtype='int16',
    device=1
)
sd.wait()

wav_path = "static/test.wav"
sf.write(wav_path, recording, sample_rate)
print(f"Saved to {wav_path}")

print("Sending to API...")
with open(wav_path, "rb") as f:
    response = requests.post(
        "http://127.0.0.1:3500/assistant/ask",
        files={"audio": ("test.wav", f, "audio/wav")}
    )

print("Status:", response.status_code)
print("Response:", response.json())