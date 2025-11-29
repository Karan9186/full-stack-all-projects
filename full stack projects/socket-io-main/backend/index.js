import express from "express";
import { config } from "dotenv";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";
import route from "./route/user.route.js";
import db from "./utils/db.connect.js";
import { log } from "console";
config();

const app = express();
app.use(express.json());
const corsOptions = {
  origin: ["http://localhost:5174","http://localhost:5173"], // React app URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));

const server = http.createServer(app);

const io = new SocketServer(server, {
  cors: {
    origin: ["http://localhost:5174","http://localhost:5173"], // React app URL
    methods: ["GET", "POST"],
  },
});
app.use(route);
app.get("/", (req, res) => {
  res.send("working");
});

let onlineUsers = []; // Array to track users and their socket IDs
app.use("/uploads", express.static("uploads"));

io.on("connection", (socket) => {
  console.log("a user connected");

  // When a user connects, we expect a 'user connected' event with the username
  socket.on("user connected", (username) => {
    // Add the username and socket ID to the online users list
    onlineUsers.push({ username, socketId: socket.id });
    console.log("Online users:", onlineUsers);

    // Emit the updated list of online users to all clients
    io.emit("onlineUsers", onlineUsers);
  });

  socket.on("chat message", (data) => {
    // Insert the message into the MySQL database
    const { text, sender, receiverId, socketID } = data;

    const query = `INSERT INTO usermsg (sender, receiver, msg) VALUES (?, ?, ?)`;
    db.execute(query, [sender, receiverId, text], (err, result) => {
      if (err) {
        console.error("Error inserting message: ", err);
        return;
      }

      // Server-side: Listen for the 'typing' event from the sender
      socket.on("typing", (data) => {
        console.log("sdfsdf", data);

        socket.to(data.receiverId).emit("typing", {
          senderId: data.senderId,
          receiverId, // Sender's ID
          typing: true, // Indicate that the sender is typing
        });
      });

      // After saving the message, you can emit the message back to the client (or broadcast)
      socket.on("chat message", (msg) => {
        // Emit the message to the correct receiver
        io.to(msg.receiverId).emit("chat message", msg);
      });
    });
  });

  socket.on("message read", ({ messageId, receiverId }) => {
    // Update message status to 'read' in the database
    const query = `UPDATE usermsg SET isread = 'read' WHERE id = ? AND receiver = ?`;
    db.execute(query, [messageId, receiverId], (err, result) => {
      if (err) {
        console.error("Error updating message status: ", err);
        return;
      }

      console.log(`Message ${messageId} read by user ${receiverId}`);
      // Optionally, emit an event back to the sender to notify them
      io.to(receiverId).emit("message read", { messageId, status: "read" });
    });
  });
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("user disconnected");

    // Remove the user from the onlineUsers array based on socket ID
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("Online users:", onlineUsers);

    // Emit the updated list of online users to all clients
    console.log(" --",onlineUsers)
    io.emit("onlineUsers", onlineUsers);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
