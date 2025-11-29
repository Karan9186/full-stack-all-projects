const express=require('express');

const app=express();
app.get("/",(req,res)=>{
  res.send("foud what you want");
})
app.get("/profile/:me",(req,res)=>{
  res.send(`profile karan at this`);
})
app.listen(3000);