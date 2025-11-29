const userSchema=require("../model/userSchema")
const NewUser=userSchema.newcolluser

exports.getAllUser=async(req,res)=>{
  const allUser=await NewUser.find();
  res.send(allUser)
}

exports.createUser=(req,res)=>{
  const User=new NewUser(req.body);
  User.save()
    .then((doc)=>{
      res.send(doc)
    })
    .catch((err)=>{
      res.send({message:"error to create user"})
      console.log(err)
    })
}

exports.deleteUser=async(req,res)=>{
  const id=req.params.id
  try{
    await NewUser.findOneAndDelete({_id:id});
    res.send({message:"user deleted"})
  }catch(err){
    res.send({message:"error to delete user"})
    console.log(err)
  }
}

exports.updateUser=async(req,res)=>{
  const id=req.params.id;
  try{
    await NewUser.findOneAndUpdate({_id:id},req.body,{new:true})
    res.send({message:"user updated"})
  }catch(err){
    res.send({message:"eror to update user"})
    console.log(err);
  }
}

exports.getSingleUser=async(req,res)=>{
  const id=req.params.id;
  try{
    const user=await NewUser.findOne({_id:id})
    res.send(user)
  }catch(err){
    res.send({message:"error to find user"})
    console.log(err)
  }
}