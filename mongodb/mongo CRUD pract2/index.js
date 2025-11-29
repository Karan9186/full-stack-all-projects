const express=require('express');
const { ConnectionCheckOutFailedEvent } = require('mongodb');
const app=express();
const mongoose=require('mongoose')
const product=require("./controller/productController")

mainConnection().catch((err)=>console.log(err))
app.use(express.json())
async function mainConnection(){
  await mongoose.connect("mongodb://127.0.0.1:27017/karan");
  console.log("connected")
}


app.post("/product",product.createUser).patch("/product/:id",product.updateProduct).get("/product",product.getAllUser).get("/product/:id",product.getOneUser).delete("/product/:id",product.deleteProduct).put("/product/:id",product.replaceProduct)

app.listen(3000)