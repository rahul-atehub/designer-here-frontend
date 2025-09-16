// src/lib/socket.js
import { io } from "socket.io-client";
import { API } from "@/config";

const socket = io(API.SOCKET_IO_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
