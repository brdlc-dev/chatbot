<template>
  <div class="chat-container">
    <!-- Username screen -->
    <div v-if="!username" class="username-box">
      <h2>Enter your username</h2>
      <input v-model="tempUsername" placeholder="Enter username" />
      <button @click="joinChat">Join Chat</button>
    </div>

    <!-- Chat Page -->
    <div v-else>
      <h2>Welcome, {{ username }} 👋</h2>

      <div class="users">
        <h3>Active Users</h3>
        <ul>
          <li v-for="user in activeUsers" :key="user.socketId">
            {{ user.username }}
          </li>
        </ul>
      </div>

      <div class="messages">
        <div v-for="(msg, index) in messages" :key="index" class="message">
          <strong>{{ msg.username }}:</strong> {{ msg.message }}
        </div>

        <div class="notif" v-for="(n, index) in notifications" :key="'notif'+index">
          ⭐ {{ n }}
        </div>
      </div>

      <input
        v-model="message"
        placeholder="Type message..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import socket, { registerUser } from "./socket";

export default {
  data() {
    return {
      username: null,
      tempUsername: "",
      message: "",
      messages: [],
      notifications: [],
      activeUsers: [],
    };
  },

  mounted() {
    socket.on("receive-message", (data) => {
      this.messages.push(data);
    });

    socket.on("user-joined", (username) => {
      this.notifications.push(`${username} joined the chat`);
    });

    socket.on("user-left", (username) => {
      this.notifications.push(`${username} left the chat`);
    });

    socket.on("active-users", (users) => {
      this.activeUsers = users;
      console.log("Active users:", users);
    });
  },

  methods: {
    joinChat() {
      if (!this.tempUsername.trim()) return;
      this.username = this.tempUsername;
      registerUser(this.username);
    },

    sendMessage() {
      if (!this.message.trim()) return;

      socket.emit("send-message", {
        username: this.username,
        message: this.message,
      });

      this.message = "";
    },
  },
};
</script>

<style>
.chat-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}

.username-box {
  text-align: center;
}

.users {
  background: #f4f4f4;
  padding: 10px;
  margin-bottom: 15px;
}

.messages {
  border: 1px solid #ccc;
  height: 300px;
  overflow-y: scroll;
  margin-bottom: 10px;
  padding: 5px;
}

.message {
  margin: 5px 0;
}

.notif {
  color: #888;
  font-size: 14px;
  margin: 3px 0;
}
</style>
