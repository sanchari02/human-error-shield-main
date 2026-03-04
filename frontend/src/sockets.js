import { io } from 'socket.io-client'
import { SOCKET_URL } from './config'

// Optional: only connect if you add socket endpoints server-side via ASGI/Socket.IO
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket']
})
