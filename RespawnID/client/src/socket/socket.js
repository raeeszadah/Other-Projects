import { io } from "socket.io-client";
import { backendUrl } from "../utils/api";

const socketUrl =
  backendUrl || (import.meta.env.DEV ? "http://localhost:5001" : "");

export const socket = io(socketUrl, {
  withCredentials: true,
  autoConnect: false,
});
