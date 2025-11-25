import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// Register username
export function registerUser(username) {
  socket.emit("register-user", username);
}

export default socket;
