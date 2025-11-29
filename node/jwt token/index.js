const express = require('express')
const app=express()
const mongoose=require('mongoose')
const prdSchema=require("./model/productModel")
const prdController=require("./controller/productController")
const productModel = require('./model/productModel')
const jwt=require("jsonwebtoken")

async function mainConn(){
  await mongoose.connect("mongodb://127.0.0.1:27017/productdb");
  console.log("connected")
}
const auth=(req,res,next)=>{
  try{

    const token=req.get("Authorization").split("Bearer ")[1]
  var decode=jwt.verify(token,"karan")  
  if(decode.email){
    next()
  }
  else{
    res.send(401)
  }
  }
  catch(err){
    res.send(401);
  }
}

mainConn().catch((err)=>console.log("error while connecting"))
app.use(express.json())

app.get("/",prdController.getAll).post("/",prdController.createProduct).delete("/:id",auth,prdController.deleteProduct).patch("/:id",auth,prdController.updatePrd).put("/:id",auth,prdController.replacePrd)

app.get("/login",prdController.getAll)
app.post("/signup",prdController.createProduct)
app.listen(3000)