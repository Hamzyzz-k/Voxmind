// API configuration - uses environment variable or defaults to localhost
const API = import.meta.env.VITE_API_URL || "http://localhost:3500"

export default API
