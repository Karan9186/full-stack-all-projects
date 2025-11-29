import e, { json } from "express";
import userRoutes from "./routes/client/user.route.js";
import dotenv from "dotenv";
import cors from "cors";
import pdfRoutes from "./routes/pdf/pdf.route.js";
dotenv.config();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"], // Only allow these domains
  methods: ["GET", "POST", "PUT", "DELETE"], // Only allow these HTTP methods
  allowedHeaders: "Content-Type, Authorization", // Only allow these headers
  credentials: true, // Allow cookies to be sent with requests
};

// Use CORS middleware with the custom options

const app = e();
app.use(e.json());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use(json());
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/pdf", pdfRoutes);

app.listen(3000, () => {
  console.log("app is running");
});
