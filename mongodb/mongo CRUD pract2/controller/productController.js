const mongoose=require("mongoose")
const modelSchema=require("../model/schema");
const e = require("express");
const NewProduct=modelSchema.product

exports.createUser=async(req,res)=>{
  const product=new NewProduct(req.body);

  product.save()
    .then((doc)=>{
      console.log(doc)
      res.send({message:"user created"});
    })
    .catch((err)=>{
      console.log(err);
      res.status(400).send({message:"product not created"})
    })
}

exports.updateProduct=async(req,res)=>{
  const id=req.params.id;
  try{
    const product=await NewProduct.findOneAndUpdate({_id:id},req.body,{new:true});
    res.send({message:"product updated"})
    console.log(product)
  }
  catch(err){
    console.log(err)
    res.status(400).send({message:"product is not update"})
  }
}

exports.replaceProduct=async(req,res)=>{
  const id=req.params.id;
  try{
   const product=await NewProduct.findOneAndReplace({_id:id},req.body,{new:true})
    res.send({message:"product replaced"})
    console.log(product)
  }
  catch(err){
    console.log(err)
    req.status(400).send({message:"not replaced"})
  }
}

exports.getAllUser=async(req,res)=>{
  const allProduct=await NewProduct.find();
  res.send(allProduct)
}

exports.getOneUser=async(req,res)=>{
  const id=req.params.id;
  try{
    const product=await NewProduct.findOne({_id:id})
    res.send(product)
  }
  catch(err){
    console.log(err)
    res.status(400).send({message:"product not found"})
  }
}

exports.deleteProduct=async(req,res)=>{
  const id=req.params.id;
  try{
    const product=await NewProduct.findOneAndDelete({_id:id})
    res.send({message:"product deleted"})
  }
  catch(err){
    console.log(err);
    res.status(400).send({message:"product not deleted"})
  }
}