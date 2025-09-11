// src/lib/socket.js
import { io } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // set in .env.local
const socket = io(API_URL, {
  withCredentials: true, // optional, useful if you need cookies/auth
  transports: ["websocket"], // ensures fast WS, skips long polling
});

export default socket;
