const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let users = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle username registration
  socket.on("register-user", (username) => {
    users.push({
      socketId: socket.id,
      username: username,
    });

    console.log("Users:", users);

    // Notify others
    socket.broadcast.emit("user-joined", username);

    // Send updated users list
    io.emit("active-users", users);
  });

  // Handle chat messages
  socket.on("send-message", (data) => {
    io.emit("receive-message", data);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    const user = users.find((u) => u.socketId === socket.id);

    if (user) {
      console.log("User disconnected:", user.username);

      users = users.filter((u) => u.socketId !== socket.id);

      io.emit("active-users", users);
      io.emit("user-left", user.username);
    }
  });
});

server.listen(3000, () => {
  console.log("Socket.io server running on port 3000");
});
