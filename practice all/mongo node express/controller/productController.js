const mongoose=require('mongoose')
const schemaUser=require('../model/productModel')
const NewUser=schemaUser.newUserCollection
const ejs=require('ejs')
const path=require('path')
const jsonwebtoken=require('jsonwebtoken')

exports.createUser=(req,res)=>{
  const user=new NewUser(req.body);
  var token=jsonwebtoken.sign({email:req.body.email},'karan');
  user.token=token;
  user.save()
    .then((doc)=>{
      console.log(doc)
      res.status(200).send({message:"user created"});
    })
    .catch((err)=>{
      console.log(err)
      res.status(400).send({message:"error occure in user creation"})
    })
}


exports.getAllUser=async(req,res)=>{
  const allUser=await NewUser.find();
  res.send(allUser)
}

exports.getOneUser=async(req,res)=>{
  const id=req.params.id;
  try{
    const user=await NewUser.findOne({_id:id});
    res.send(user);
  }
  catch(err){
    res.status(300).send({message:"user not found"})
  }
}

exports.deleteUser=async(req,res)=>{
  const id=req.params.id;
  try{
    const user=await NewUser.findOneAndDelete({_id:id});
    res.send(user);
  }
  catch(err){
    res.status(300).send({message:"user not found to delete"})
  }
}

exports.updateUser=async(req,res)=>{
  const id=req.params.id;
  try{
    const user=await NewUser.findOneAndUpdate({_id:id},req.body,{new:true})
    res.send(user);
  }
  catch(err){
    res.status(500).send({message:"error to update user"})
  }
}

exports.replaceUser=async(req,res)=>{
  const id=req.params.id;
  try{
    const user=await NewUser.findOneAndReplace({_id:id},req.body,{new:true});
    res.send(user);
  }
  catch(err){
    res.status(500).send({message:"error to replace user"})
  }
}

exports.userCreateFile=(req,res)=>{
  ejs.renderFile(path.resolve(__dirname,'../view/create.ejs'),function(err,str){
    res.send(str)
  })
}