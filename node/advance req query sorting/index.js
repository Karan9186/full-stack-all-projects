import express from "express";
import mongoose from "mongoose";
import allFunction from "./controller/product.controller.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

const connectFun = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/productdemo");
    console.log("conneted");
  } catch (err) {
    console.log(err);
  }
};

connectFun();

app.get("/product", allFunction[0]);
app.post("/product", allFunction[1]);

app.listen(4000, () => {
  console.log("server running");
});
