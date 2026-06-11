from fastapi import APIRouter
import requests
import os

router = APIRouter()

ESP_IP = os.getenv("ESP8266_IP", "192.168.1.100")

COMMANDS = {
    "turn on the light": ("light", "on"),
    "turn off the light": ("light", "off"),
    "light on": ("light", "on"),
    "light off": ("light", "off"),
    "बत्ती जलाओ": ("light", "on"),
    "बत्ती बंद करो": ("light", "off"),
    "விளக்கை போடு": ("light", "on"),
    "விளக்கை அணை": ("light", "off"),
}

@router.post("/command")
async def iot_command(text: str):
    text_lower = text.lower().strip()
    for phrase, (device, state) in COMMANDS.items():
        if phrase in text_lower:
            try:
                url = f"http://{ESP_IP}/{device}?state={state}"
                requests.get(url, timeout=3)
                return {"action": f"{device} turned {state}", 
                        "status": "success"}
            except Exception:
                return {"action": f"{device} turned {state}", 
                        "status": "esp_offline"}
    return {"action": "no_command_detected", "status": "ok"}