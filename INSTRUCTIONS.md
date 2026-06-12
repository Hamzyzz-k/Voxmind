# VoxMind Project Instructions

## Project Overview

**VoxMind** is a voice-controlled smart home assistant system with AI-powered features. It allows users to authenticate via voice, control IoT devices through voice commands, and interact with an AI assistant powered by Claude.

### Key Features
- 🎤 Voice-based authentication and login
- 🏠 Smart home control via voice commands
- 🧠 AI-powered assistant with conversation memory
- 🌍 Multilingual support (English, Hindi, Tamil, etc.)
- 🔊 Text-to-speech audio responses
- 🎯 Whisper-based speech-to-text recognition

---

## Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.13.1)
- **Server**: Uvicorn
- **Audio Processing**: pydub, ffmpeg-python
- **AI/LLM**: Anthropic Claude API
- **HTTP Client**: requests
- **Environment**: Python venv

### Frontend
- **Framework**: React 19.2.6
- **Build Tool**: Vite 8.0.12
- **HTTP Client**: axios
- **Package Manager**: npm
- **Styling**: CSS

### Hardware (Optional)
- **Microcontroller**: ESP8266
- **Protocol**: HTTP over WiFi

---

## Project Structure

```
voxmind/
├── backend/                    # Python FastAPI backend
│   ├── main.py                # Entry point, FastAPI app initialization
│   ├── requirements.txt        # Python dependencies
│   ├── routes/                # API endpoint handlers
│   │   ├── auth.py           # Authentication endpoints
│   │   ├── assistant.py       # AI assistant endpoints
│   │   └── iot.py            # IoT device control endpoints
│   ├── services/              # Business logic
│   │   ├── voice_auth.py     # Voice authentication & speaker verification
│   │   ├── llm_handler.py    # Claude API integration
│   │   ├── tts_handler.py    # Text-to-speech conversion
│   │   └── whisper_stt.py    # Speech-to-text transcription
│   ├── static/                # Temporary audio file storage
│   ├── voice_profiles/        # User voice profile storage (users.json)
│   └── pretrained_models/     # Pre-trained ML models (e.g., speaker recognition)
│
├── frontend/                   # React Vite frontend
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── main.jsx          # Entry point
│   │   ├── App.css           # Global styles
│   │   ├── index.css         # Base styles
│   │   ├── components/       # React components
│   │   │   ├── Login.jsx           # User login page
│   │   │   ├── VoiceLogin.jsx      # Voice-based authentication
│   │   │   ├── ChatWindow.jsx      # AI assistant chat interface
│   │   │   ├── SmartHome.jsx       # IoT device control interface
│   │   │   └── Waveform.jsx        # Audio visualization
│   │   └── assets/           # Static assets
│   ├── public/                # Public static files
│   ├── package.json           # NPM dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── eslint.config.js       # ESLint configuration
│   └── vercel.json            # Vercel deployment config
│
├── esp8266/                   # Microcontroller firmware
│   └── voxmind_esp.ino       # ESP8266 Arduino code for IoT control
│
└── docs/                      # Documentation

```

---

## Development Environment Setup

### Prerequisites
- Python 3.13.1+
- Node.js 18+ & npm
- Git
- FFmpeg (for audio processing)

### Backend Setup

1. **Create and activate virtual environment**
   ```powershell
   cd C:\Users\HAMZAH\voxmind\backend
   python -m venv venv
   .\venv\Scripts\activate
   ```

2. **Install dependencies**
   ```powershell
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```powershell
   # Create .env file in backend directory
   copy .env.example .env  # or create manually
   ```
   
   Required environment variables:
   - `ANTHROPIC_API_KEY` - Claude API key from Anthropic
   - `WHISPER_API_KEY` - OpenAI Whisper API key (or local model path)
   - `TTS_SERVICE_KEY` - Text-to-speech service key
   - `SECRET_KEY` - JWT secret for authentication

4. **Run the backend server**
   ```powershell
   uvicorn main:app --reload --port 3500
   ```
   
   The API will be available at `http://localhost:3500`
   - OpenAPI docs: `http://localhost:3500/docs`
   - ReDoc: `http://localhost:3500/redoc`

### Frontend Setup

1. **Install dependencies**
   ```powershell
   cd C:\Users\HAMZAH\voxmind\frontend
   npm install
   ```

2. **Run development server**
   ```powershell
   npm run dev
   ```
   
   Frontend will be available at `http://localhost:5173` (default Vite port)

3. **Build for production**
   ```powershell
   npm run build
   ```

---

## API Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Register new user with voice profile |
| POST | `/auth/login` | Voice-based login authentication |
| POST | `/auth/verify` | Verify voice sample for authentication |

**Request/Response examples:**
```
POST /auth/register
Body: { username, voice_sample (audio), password }
Response: { user_id, token }

POST /auth/login
Body: { username, voice_sample (audio) }
Response: { token, success }
```

### Assistant Routes (`/assistant`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/assistant/ask` | Send voice/text query to AI |
| POST | `/assistant/memory` | Update user context/memory |
| GET | `/assistant/history` | Get conversation history |

**Request/Response examples:**
```
POST /assistant/ask
Body: { user_id, query (text or audio), language }
Response: { response_text, response_audio, timestamp }

POST /assistant/memory
Body: { user_id, memory_update }
Response: { success, updated_memory }
```

### IoT Routes (`/iot`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/iot/command` | Send voice command to control devices |
| GET | `/iot/devices` | Get list of connected devices |
| POST | `/iot/pair` | Pair new IoT device |

**Request/Response examples:**
```
POST /iot/command
Body: { user_id, command (text), device_type }
Response: { success, device_status, confirmation_audio }

GET /iot/devices
Response: { devices: [{id, name, type, status}] }
```

---

## Core Services

### 1. Voice Authentication Service (`voice_auth.py`)
- Captures user voice samples during registration
- Performs speaker verification on login
- Uses ECAPA-TDNN model for voice embeddings
- Stores voice profiles for future authentication

### 2. LLM Handler Service (`llm_handler.py`)
- Integrates with Anthropic Claude API
- Manages conversation context and history
- Processes user queries and generates responses
- Maintains user-specific memory/context

### 3. Text-to-Speech Service (`tts_handler.py`)
- Converts text responses to audio
- Supports multiple languages
- Caches generated audio for efficiency
- Handles audio format conversions

### 4. Speech-to-Text Service (`whisper_stt.py`)
- Uses OpenAI Whisper for transcription
- Supports multilingual transcription
- Processes uploaded audio files
- Handles various audio formats

---

## Running the Application

### Start Both Frontend and Backend

**Terminal 1 - Backend:**
```powershell
cd C:\Users\HAMZAH\voxmind\backend
.\venv\Scripts\activate
uvicorn main:app --reload --port 3500
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Users\HAMZAH\voxmind\frontend
npm run dev
```

Then open browser to `http://localhost:5173`

### User Workflows

#### 1. Voice Registration
1. User accesses `/VoiceLogin` component
2. Clicks "Register" and provides username
3. Records voice sample (3-5 seconds)
4. Voice profile saved via `POST /auth/register`
5. Authentication token returned

#### 2. Voice Login
1. User accesses login page
2. Provides username
3. Records voice sample
4. Backend verifies against stored profile via `POST /auth/login`
5. Success redirects to chat interface

#### 3. Chat with AI Assistant
1. User enters text or records voice query
2. Query transcribed to text (if voice) via `whisper_stt`
3. Sent to Claude via `llm_handler`
4. Response generated with context awareness
5. Response converted to audio via `tts_handler`
6. Audio and text displayed to user

#### 4. Smart Home Control
1. User says "Turn on the lights"
2. Query processed by assistant
3. Intent extraction recognizes device control command
4. Command sent to IoT devices via `/iot/command`
5. Device status updated and confirmation returned

---

## Testing

### Backend Testing
```powershell
cd backend
pytest test_api.py
pytest test_record.py
```

### Frontend Testing (if set up)
```powershell
cd frontend
npm test
```

### Manual API Testing
Use the interactive OpenAPI documentation:
- Navigate to `http://localhost:3500/docs`
- Try endpoints directly in the Swagger UI

---

## Configuration

### Environment Variables (.env)
```
ANTHROPIC_API_KEY=sk-ant-...
WHISPER_API_KEY=sk-...
TTS_SERVICE_KEY=your-tts-key
SECRET_KEY=your-jwt-secret
DATABASE_URL=sqlite:///./voxmind.db
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
VOICE_PROFILE_PATH=./voice_profiles
MODEL_PATH=./pretrained_models
```

### Backend Configuration
- **CORS**: Currently allows all origins (should restrict in production)
- **Audio Storage**: Uses `static/` directory for temporary files
- **Voice Profiles**: Stored in `voice_profiles/users.json`
- **Models**: Pre-trained models in `pretrained_models/`

### Frontend Configuration
See [frontend/vite.config.js](frontend/vite.config.js) for build settings.

---

## Common Tasks

### Add a New API Endpoint
1. Create handler function in appropriate `routes/` file
2. Use FastAPI decorators: `@router.post()`, `@router.get()`, etc.
3. Include in `main.py` with `app.include_router()`
4. Update this documentation

### Add a New React Component
1. Create `.jsx` file in `frontend/src/components/`
2. Import in `App.jsx`
3. Add routing/rendering logic
4. Implement axios calls to backend API

### Modify ML Models
1. Update models in `backend/pretrained_models/`
2. Update corresponding service file (e.g., `voice_auth.py`)
3. Test with existing voice profiles
4. Document changes

### Deploy to Production
See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- GitHub push instructions
- Render backend deployment
- Vercel frontend deployment
- Environment variable setup for production

---

## Troubleshooting

### Backend Issues
| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError` | Ensure venv is activated and dependencies installed: `pip install -r requirements.txt` |
| `APIError` with Claude | Check `ANTHROPIC_API_KEY` is set and valid in `.env` |
| Audio processing errors | Ensure FFmpeg is installed: `ffmpeg -version` |
| CORS errors in frontend | Check `CORS_ORIGINS` in `.env` includes frontend URL |

### Frontend Issues
| Issue | Solution |
|-------|----------|
| `Module not found` | Run `npm install` in frontend directory |
| API connection fails | Verify backend is running on correct port (3500) |
| Build errors | Clear cache: `rm -r node_modules && npm install` |
| Port already in use | Change port in `vite.config.js` or kill process using port |

### Audio Issues
| Issue | Solution |
|-------|----------|
| No audio input | Check microphone permissions in browser |
| Poor speech recognition | Ensure clear audio, reduce background noise |
| TTS audio not playing | Check browser audio permissions and volume |

---

## Performance Optimization

### Backend
- Use async/await for I/O operations
- Cache voice embeddings to reduce computation
- Implement request throttling for API calls
- Use connection pooling for database queries

### Frontend
- Code-split React components
- Lazy load components as needed
- Cache API responses with appropriate TTL
- Optimize audio file sizes

---

## Security Considerations

⚠️ **IMPORTANT FOR PRODUCTION:**
- [ ] Restrict CORS origins (not `*`)
- [ ] Use HTTPS/WSS for all communications
- [ ] Implement rate limiting on API endpoints
- [ ] Store voice profiles securely (encrypted)
- [ ] Use secure token storage (not localStorage for tokens)
- [ ] Validate and sanitize all user inputs
- [ ] Add authentication middleware to protected routes
- [ ] Keep API keys secure (use secret management)
- [ ] Implement request signing for IoT devices

---

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [OpenAI Whisper](https://github.com/openai/whisper)
- [ESP8266 Arduino Reference](https://arduino-esp8266.readthedocs.io/)

---

## Next Steps

1. **Environment Setup**: Copy `.env.example` to `.env` and fill in API keys
2. **Start Development**: Run backend and frontend in separate terminals
3. **Test Endpoints**: Use `/docs` endpoint to test API
4. **Implement Features**: Build components and integrate with backend
5. **Deploy**: Push to GitHub and deploy to Render + Vercel

---

*Last Updated: 2026-06-12*
