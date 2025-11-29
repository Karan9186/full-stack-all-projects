const express=require('express');
const app=express();

app.get("/",(req,res)=>{
  res.send("ok")
})
app.get("/profile/:karan",(req,res)=>{
  res.send(`welcome karan`)
})
app.listen(3000,()=>{
  console.log("runing server");
})