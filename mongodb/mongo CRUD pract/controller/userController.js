const UserSchema=require("../model/productSchema")
const mongoose=require("mongoose");
const NewUser=UserSchema.newUserSchema;

exports.createUser=(req,res)=>{
  const user=new NewUser(req.body);
  user.save()
    .then((doc)=>{
      console.log(doc);
      res.send({message:"user created"})
    })

    .catch((err)=>{
      console.log(err);
      res.status(500).send({message:"error not creating user"})
    })
}

exports.getAllUser=async(req,res)=>{
  const allUser=await NewUser.find();
  res.send(allUser)
}

exports.updateUser=async(req,res)=>{
  const id=req.params.id;
  console.log(id)
  try{
    const User=await NewUser.findOneAndUpdate({_id:id},req.body,{new:true});
    res.send(User)
  }
  catch(err){
    res.status(500).send({message:"error updating user"})
  }
}

exports.replaceUser=async(req,res)=>{
  const id=req.params.id;
  try{
    const rUser=await NewUser.findOneAndReplace({_id:id},req.body,{new:true});
    res.send(rUser);
  }
  catch(err){
    res.status(500).send({message:"error replacing user"})
  }
}

exports.findOneUser=async(req,res)=>{
  const id=req.params.id;
  try{
    const user=await NewUser.findOne({_id:id});
    res.send(user);
  }
  catch(err){
    res.status(500).send({message:"error finding user"})
  }
}
exports.deleteUser=async(req,res)=>{
  const id=req.params.id;
  try{
    const user=await NewUser.findOneAndDelete({_id:id},{new:true});
    res.send(user);
  }
  catch(err){
    res.status(500).send({message:"error deleting user"})
  }
}