export const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'
export const STREAM_URL = `${API_BASE}/video/stream`
export const PREDICT_URL = `${API_BASE}/predict`
export const PREDICT_BATCH_URL = `${API_BASE}/predict/batch`
export const VIDEO_PROCESS_URL = `${API_BASE}/video/process`
export const HEALTH_URL = `${API_BASE}/health`
export const SOCKET_URL = API_BASE.replace(/^http/, 'ws') // if you later add WebSocket
