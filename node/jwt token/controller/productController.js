const express=require("express")
const mongoose=require('mongoose')
const prdSchema=require("../model/productModel")
const jwt=require("jsonwebtoken")


exports.getAll=async(req,res)=>{
  const allProduct=await prdSchema.find()
  res.send(allProduct)
}

exports.createProduct=(req,res)=>{  
  const Prd=new prdSchema(req.body)
  var token=jwt.sign({email:req.body.name},"karan")
  Prd.token=token
  Prd.save()
    .then((doc)=>{
      console.log(doc);
      res.send("product created")
    })
    .catch((err)=>{
      console.log(err);
      res.send("error to create product")
    })
}

exports.deleteProduct=async(req,res)=>{
  const id=req.params.id;
  try{
    const deletedPrd=await prdSchema.findOneAndDelete({_id:id},{new:true})
    res.send({message:"deleted"})
    console.log(deletedPrd)
  }
  catch(err){
    res.send({message:"error in deleting"})
  }
}

exports.updatePrd=async(req,res)=>{
  const id=req.params.id;
 try{
  await prdSchema.findOneAndUpdate({_id:id},req.body,{new:true});
  res.send("product update")
 }
 catch(err){
  res.send("error to update user")
  console.log(err)
 }
}

exports.replacePrd=async(req,res)=>{
  const id=req.params.id;
  try{
    await prdSchema.findOneAndReplace({_id:id},req.body,{new:true})
    res.send("product replaced");
  }
  catch(err){
    res.send("error to replace product")
    console.log(err)
  }
}