import e, { json } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/emp.route.js";

const app = e();
app.use(json());
app.use(cors());
dotenv.config();
const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGOSE_CONNECTION);
    console.log("connected");
  } catch (e) {
    console.log(e);
  }
};
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/user", userRoute);
app.listen(300, () => {
  connection();
  console.log("Server is running on port 3000");
});
