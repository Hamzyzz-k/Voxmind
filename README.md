# VoxMind - Voice-Controlled Smart Home Assistant

A modern voice-controlled smart home system with multilingual support, featuring voice authentication and AI-powered assistant capabilities.

## Features

- 🎤 **Voice Authentication** - Secure voice-based login system
- 🏠 **Smart Home Control** - Voice commands to control IoT devices (lights, etc.)
- 🧠 **AI Assistant** - Claude-powered conversational AI
- 🌍 **Multilingual Support** - Commands in English, Hindi, Tamil, and more
- 🔊 **Text-to-Speech** - Audio responses using TTS
- 🎯 **Whisper STT** - Accurate speech-to-text recognition

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.13.1)
- **Audio Processing**: pydub, ffmpeg-python
- **AI Integration**: Claude API
- **HTTP Client**: requests
- **Server**: Uvicorn

### Frontend
- **Framework**: React 19.2.6
- **Build Tool**: Vite 8.0.12
- **HTTP Client**: axios
- **Styling**: CSS

### Hardware
- **Microcontroller**: ESP8266
- **Communication**: HTTP over WiFi

## Project Structure

```
voxmind/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── requirements.txt         # Python dependencies
│   ├── routes/
│   │   ├── auth.py            # Authentication endpoints
│   │   ├── assistant.py        # AI assistant endpoints
│   │   └── iot.py             # Smart home device control
│   ├── services/
│   │   ├── voice_auth.py      # Voice authentication service
│   │   ├── llm_handler.py     # Claude integration
│   │   ├── tts_handler.py     # Text-to-speech
│   │   └── whisper_stt.py     # Speech-to-text
│   ├── static/                 # Temporary audio files
│   ├── voice_profiles/         # User voice profiles
│   └── pretrained_models/      # Voice recognition models
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React app
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── VoiceLogin.jsx
│   │   │   └── SmartHome.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── esp8266/
    └── voxmind_esp.ino        # Microcontroller firmware
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Voice-based login

### Assistant
- `POST /assistant/ask` - Send voice query to AI
- `POST /assistant/memory` - Update user memory

### Smart Home (IoT)
- `POST /iot/command` - Send voice command to control devices

## Getting Started

### Prerequisites
- Python 3.13.1+
- Node.js 18+
- ESP8266 microcontroller (optional, for hardware control)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Configure your API keys
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the `backend` directory:

```
ANTHROPIC_API_KEY=your_claude_api_key
OPENAI_API_KEY=your_openai_api_key
ESP8266_IP=192.168.1.100
```

## Deployment

### Backend (Render)
1. Push to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Select the `frontend` directory as root
3. Set `VITE_API_URL` environment variable
4. Deploy

## Testing

```bash
# Backend tests
cd backend
python -m pytest test_api.py

# Frontend tests (if configured)
cd frontend
npm run test
```

## Future Enhancements

- Database integration for persistent user data
- Advanced voice recognition with speaker verification
- Support for more smart home devices
- Mobile app integration
- Real-time voice streaming
- Cloud backup for voice profiles

## License

MIT License

---

**Note**: For ESP8266 hardware wiring and setup, see the `/esp8266` directory documentation.
