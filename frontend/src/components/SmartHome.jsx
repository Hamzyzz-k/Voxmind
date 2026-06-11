import { useState } from "react"
import axios from "axios"

const API = "http://127.0.0.1:3500"

const devices = [
  { id: "light", name: "Light", icon: "💡" },
  { id: "fan", name: "Fan", icon: "🌀" },
]

export default function SmartHome() {
  const [states, setStates] = useState({ light: false, fan: false })
  const [log, setLog] = useState("")

  const toggle = async (device) => {
    const newState = !states[device]
    const stateStr = newState ? "on" : "off"
    try {
      await axios.post(`${API}/iot/command`, null, {
        params: { text: `turn ${stateStr} the ${device}` }
      })
      setStates(prev => ({ ...prev, [device]: newState }))
      setLog(`${device} turned ${stateStr}`)
    } catch {
      setLog("Could not connect to device")
    }
  }

  return (
    <div style={{
      width: "100%",
      maxWidth: "600px",
      background: "#111",
      borderRadius: "16px",
      padding: "1.5rem",
      marginTop: "1rem",
      border: "1px solid #222"
    }}>
      <h3 style={{
        color: "#00c9ff",
        fontSize: "0.9rem",
        marginBottom: "1rem",
        letterSpacing: "1px"
      }}>
        🏠 SMART HOME
      </h3>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {devices.map(d => (
          <div key={d.id} style={{
            flex: 1,
            minWidth: "120px",
            background: states[d.id] ? "#1a2e1a" : "#1a1a2e",
            border: `1px solid ${states[d.id] ? "#00ff9d" : "#333"}`,
            borderRadius: "12px",
            padding: "1rem",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
            onClick={() => toggle(d.id)}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{d.icon}</div>
            <div style={{
              color: states[d.id] ? "#00ff9d" : "#888",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              {d.name}
            </div>
            <div style={{
              fontSize: "0.75rem",
              color: states[d.id] ? "#00ff9d" : "#555",
              marginTop: "4px"
            }}>
              {states[d.id] ? "ON" : "OFF"}
            </div>
          </div>
        ))}
      </div>

      {log && (
        <p style={{
          color: "#888",
          fontSize: "0.8rem",
          marginTop: "1rem",
          textAlign: "center"
        }}>
          ✓ {log}
        </p>
      )}
    </div>
  )
}
