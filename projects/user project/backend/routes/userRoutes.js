const express=require('express');
const routes=express.Router();
const UserSchema=require("../model/userModel");
const User=UserSchema.UserMERN;
// get
routes.get("/",async(req,res)=>{
  try{
    const allData=await User.find();
    res.status(200).json(allData)
  }
  catch(err){
    res.status(401).json(err)
  }
})
// create
routes.post("/create",async(req,res)=>{
  try{
    const NewUser=new User(req.body);
    await NewUser.save();
    res.send({message:"user created"});
  }
  catch(err){
    res.send({message:"error to create user"})
    console.log(err)
  }
})
// delete
routes.delete("/delete/:id",async(req,res)=>{
  const id=req.params.id;
  try{
    const delUser=await User.findOneAndDelete({_id:id});
    res.status(200).json(delUser)
  }
  catch(err){
    console.log(err)
    res.sendStatus(500).json({error:err.message})
  }
})
// update
routes.patch("/upd/:id",async(req,res)=>{
  const id=req.params.id;
  try{
    const updUser=await User.findOneAndUpdate({_id:id},req.body,{new:true});
    res.status(200).json(updUser)
  }
  catch(err){
    console.log(err)
    res.sendStatus(500).json({error:err.message})
  }
})

// get signle data
routes.get("/:id",async(req,res)=>{
  const id=req.params.id
  try{
    const allData=await User.findOne({_id:id});
    res.status(200).json(allData)
  }
  catch(err){
    res.status(401).json(err)
  }
})
module.exports=routes