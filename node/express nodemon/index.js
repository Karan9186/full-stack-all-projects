const express  = require("express");

let app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use((req,res,next)=>{
  console.log("middleware ");
  next();
})
app.get("/",(req,res)=>{
  res.send("hello world");
})
app.get("/profile",(req,res)=>{
  res.send("hello me");
})
app.get("/me",(req,res,next)=>{
  return next(new Error("something want wrong"));
})
app.use((err,req,res,next)=>{
  console.error(err.stack)
  res.status(500).send("something broke")
})

app.listen(3000)