import { useState, useRef } from "react"
import axios from "axios"
import Login from "./components/Login"
import SmartHome from "./components/SmartHome"

const API = "http://127.0.0.1:3500"

export default function App() {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState("idle")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [language, setLanguage] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const mediaRecorder = useRef(null)
  const chunks = useRef([])
  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const analyserRef = useRef(null)
  const audioCtxRef = useRef(null)

  if (!user) {
    return <Login onLogin={(username) => setUser(username)} />
  }

  const drawWaveform = () => {
    const canvas = canvasRef.current
    if (!canvas || !analyserRef.current) return
    const ctx = canvas.getContext("2d")
    const analyser = analyserRef.current
    const data = new Uint8Array(analyser.frequencyBinCount)
    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(data)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const barWidth = canvas.width / data.length
      data.forEach((val, i) => {
        const h = (val / 255) * canvas.height
        const green = Math.floor((val / 255) * 200 + 55)
        ctx.fillStyle = `rgb(0, ${green}, 150)`
        ctx.fillRect(i * barWidth, canvas.height - h, barWidth - 1, h)
      })
    }
    draw()
  }

  const stopWaveform = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioCtxRef.current = new AudioContext()
      const source = audioCtxRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioCtxRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      source.connect(analyserRef.current)
      drawWaveform()
      chunks.current = []
      mediaRecorder.current = new MediaRecorder(stream)
      mediaRecorder.current.ondataavailable = e => chunks.current.push(e.data)
      mediaRecorder.current.onstop = handleStop
      mediaRecorder.current.start()
      setStatus("recording")
    } catch (err) {
      alert("Microphone access denied. Please allow mic access.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop()
      stopWaveform()
      setStatus("processing")
    }
  }

  const handleStop = async () => {
    const blob = new Blob(chunks.current, { type: "audio/wav" })
    const form = new FormData()
    form.append("audio", blob, "question.wav")
    try {
      const res = await axios.post(`${API}/assistant/ask`, form)
      setQuestion(res.data.question)
      setAnswer(res.data.answer)
      setLanguage(res.data.language)
      setStatus("answered")
      playResponse(res.data.audio_url)
    } catch (err) {
      setStatus("error")
      setAnswer("Something went wrong. Please try again.")
    }
  }

  const playResponse = async (audioUrl) => {
    try {
      const audio = new Audio(`${API}${audioUrl}?t=${Date.now()}`)
      audio.crossOrigin = "anonymous"
      const actx = new AudioContext()
      await actx.resume()
      const src = actx.createMediaElementSource(audio)
      analyserRef.current = actx.createAnalyser()
      analyserRef.current.fftSize = 256
      src.connect(analyserRef.current)
      analyserRef.current.connect(actx.destination)
      drawWaveform()
      setIsPlaying(true)
      await audio.play()
      audio.onended = () => {
        stopWaveform()
        setIsPlaying(false)
      }
    } catch (err) {
      console.error("Audio play error:", err)
      setIsPlaying(false)
    }
  }

  const reset = () => {
    setStatus("idle")
    setQuestion("")
    setAnswer("")
    setLanguage("")
    stopWaveform()
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
      color: "#fff",
      padding: "2rem"
    }}>
      <h1 style={{
        fontSize: "2.5rem",
        fontWeight: "700",
        marginBottom: "0.5rem",
        background: "linear-gradient(90deg, #00c9ff, #00ff9d)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}>
        VoxMind
      </h1>

      <p style={{ color: "#00ff9d", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
        Welcome, {user} 👋
      </p>

      <p style={{ color: "#888", marginBottom: "2rem", fontSize: "1rem" }}>
        Voice-Authenticated AI Assistant
      </p>

      <canvas ref={canvasRef} width={500} height={80} style={{
        borderRadius: "12px",
        background: "#111",
        marginBottom: "2rem",
        width: "100%",
        maxWidth: "500px"
      }} />

      {status === "idle" && (
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          style={{
            width: "100px", height: "100px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00c9ff, #00ff9d)",
            border: "none", cursor: "pointer",
            fontSize: "2rem", color: "#000",
            boxShadow: "0 0 30px rgba(0,201,255,0.4)"
          }}>
          🎙️
        </button>
      )}

      {status === "recording" && (
        <button
          onMouseUp={stopRecording}
          onTouchEnd={stopRecording}
          style={{
            width: "100px", height: "100px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
            border: "none", cursor: "pointer",
            fontSize: "2rem", animation: "pulse 1s infinite",
            boxShadow: "0 0 30px rgba(255,65,108,0.6)"
          }}>
          ⏹️
        </button>
      )}

      {status === "processing" && (
        <div style={{ fontSize: "1rem", color: "#00c9ff" }}>
          Processing your question...
        </div>
      )}

      {status === "answered" && (
        <div style={{
          width: "100%", maxWidth: "600px",
          background: "#111",
          borderRadius: "16px",
          padding: "1.5rem",
          marginTop: "1rem"
        }}>
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ color: "#888", fontSize: "12px" }}>
              YOU ASKED — {language.toUpperCase()}
            </span>
            <p style={{ margin: "4px 0", fontSize: "1rem", color: "#fff" }}>
              {question}
            </p>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ color: "#00ff9d", fontSize: "12px" }}>
              VOXMIND {isPlaying ? "🔊 SPEAKING..." : ""}
            </span>
            <p style={{
              margin: "4px 0", fontSize: "0.95rem",
              color: "#ccc", lineHeight: "1.6",
              maxHeight: "200px", overflowY: "auto"
            }}>
              {answer}
            </p>
          </div>
          <button onClick={reset} style={{
            padding: "8px 24px",
            background: "transparent",
            border: "1px solid #333",
            borderRadius: "20px",
            color: "#888", cursor: "pointer",
            fontSize: "0.9rem"
          }}>
            Ask another question
          </button>
        </div>
      )}

      {status === "error" && (
        <div>
          <p style={{ color: "#ff416c" }}>{answer}</p>
          <button onClick={reset} style={{
            padding: "8px 24px",
            background: "transparent",
            border: "1px solid #ff416c",
            borderRadius: "20px",
            color: "#ff416c", cursor: "pointer"
          }}>
            Try again
          </button>
        </div>
      )}

      <SmartHome />

      <p style={{
        marginTop: "2rem", color: "#444",
        fontSize: "0.8rem", textAlign: "center"
      }}>
        Hold the button and speak • Supports English, Hindi, Tamil & more
      </p>

      <button onClick={() => setUser(null)} style={{
        marginTop: "1rem",
        padding: "6px 16px",
        background: "transparent",
        border: "1px solid #333",
        borderRadius: "20px",
        color: "#555",
        cursor: "pointer",
        fontSize: "0.8rem"
      }}>
        Logout
      </button>

    </div>
  )
}