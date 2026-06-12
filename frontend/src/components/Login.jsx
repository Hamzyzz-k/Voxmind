import { useState } from "react"
import axios from "axios"
import API from "../config"

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!username || !password) {
      setMessage("Please enter username and password")
      return
    }
    setLoading(true)
    setMessage("")
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register"
      const res = await axios.post(`${API}${endpoint}`, {
        username,
        password
      })
      if (mode === "register") {
        setMessage("Account created! Please login.")
        setMode("login")
      } else {
        onLogin(username)
      }
    } catch (err) {
      setMessage(err.response?.data?.detail || "Something went wrong")
    }
    setLoading(false)
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
      <p style={{ color: "#888", marginBottom: "2.5rem" }}>
        Voice-Authenticated AI Assistant
      </p>

      <div style={{
        background: "#111",
        borderRadius: "16px",
        padding: "2rem",
        width: "100%",
        maxWidth: "380px",
        border: "1px solid #222"
      }}>
        <h2 style={{
          fontSize: "1.2rem",
          marginBottom: "1.5rem",
          color: "#fff",
          textAlign: "center"
        }}>
          {mode === "login" ? "Welcome back" : "Create account"}
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "#1a1a2e",
            border: "1px solid #333",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "1rem",
            marginBottom: "1rem",
            outline: "none",
            boxSizing: "border-box"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "#1a1a2e",
            border: "1px solid #333",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "1rem",
            marginBottom: "1.5rem",
            outline: "none",
            boxSizing: "border-box"
          }}
        />

        {message && (
          <p style={{
            color: message.includes("created") ? "#00ff9d" : "#ff416c",
            fontSize: "0.85rem",
            marginBottom: "1rem",
            textAlign: "center"
          }}>
            {message}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: loading
              ? "#333"
              : "linear-gradient(135deg, #00c9ff, #00ff9d)",
            border: "none",
            borderRadius: "8px",
            color: "#000",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "1rem"
          }}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
        </button>

        <p style={{
          textAlign: "center",
          color: "#888",
          fontSize: "0.85rem"
        }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage("") }}
            style={{ color: "#00c9ff", cursor: "pointer" }}>
            {mode === "login" ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  )
}