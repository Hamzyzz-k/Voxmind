from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, assistant, iot
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="VoxMind API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(assistant.router, prefix="/assistant", tags=["Assistant"])
app.include_router(iot.router, prefix="/iot", tags=["Smart Home"])

@app.get("/")
def root():
    return {"message": "VoxMind API is running"}