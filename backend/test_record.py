import sounddevice as sd
import soundfile as sf
import time
import os

os.makedirs("static", exist_ok=True)
print("Recording in 3 seconds... get ready!")
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
sf.write("static/test.wav", recording, sample_rate)
print("Done! Saved to static/test.wav")
