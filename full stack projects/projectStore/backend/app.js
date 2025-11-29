import e from "express";
import dotenv from "dotenv";
import { connection } from "./db/mongoose.connection.js";
import storeRoutes from "./routes/store.routes.js";
dotenv.config();
const app = e();

connection()
  .then(() => console.log("connected"))
  .catch((err) => console.log("error to connect=", err));

app.use(e.json())
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/store",storeRoutes)

app.listen(process.env.PORT, () => {
  console.log("running");
});
