import express from "express";
import getUserRoute from "./routes/index.js";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";

// Initialize express and create server
const app = express();
const server = http.createServer(app);

// Use CORS middleware for the express app
app.use(
  cors({
    origin: "*", // You can modify the origin as needed (e.g., "http://your-client-url.com")
  })
);

// Use the routes
app.use("/api/user", getUserRoute);

// Initialize Socket.IO with server
const io = new Server(server, {
  cors: {
    origin: "*", // You can adjust this as needed
    methods: ["GET", "POST"],
  },
});

// socket.io connection
io.on("connection", (client) => {
  // Listen for the 'message' event from this client
  client.on("message", (msg) => {
    console.log("the message is:", msg); // Print the message from the client
    io.emit("newMessage", msg);
  });

  // Handle disconnecting client (optional)
  client.on("disconnect", () => {
    console.log("User disconnected:", client.id);
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
