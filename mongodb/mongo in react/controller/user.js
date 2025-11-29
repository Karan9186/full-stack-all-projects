
const importUser=require('../model/userSchema')
const NewUser=importUser.newUser

exports.createUser=(req,res)=>{
  const user=new NewUser(req.body);
  user.save()
    .then((doc) => {
      console.log(doc);
      res.send(doc);
     
    })
   .catch((err) => {
      console.error(err);
      res.status(500).send({ message: 'Error creating user' });
     
    });
}

exports.getAllUser=async(req,res)=>{
  const user=await NewUser.find();
  res.json(user);
}

exports.getUser=async(req,res)=>{
  const id=req.params.id;
  const user=await NewUser.findById(id);
  res.json(user)
  res.end("find")
}


exports.deleteUser=async(req,res)=>{
  const id=req.params.id;
  try{
    const repUser=await NewUser.findOneAndDelete({_id:id},req.body,{new:true})
    res.send(repUser)
  }
  catch(err){
    res.send(400).json(err)
  }
}

exports.replaceUser=async(req,res)=>{
  const id=req.params.id;
  try{
    const repUser=await NewUser.findOneAndReplace({_id:id},req.body,{new:true})
    res.send(repUser)
  }
  catch(err){
    res.send(400).json(err)
  }
}

exports.updateUser=async(req,res)=>{
  const id=req.params.id;
  try{
    const repUser=await NewUser.findOneAndUpdate({_id:id},req.body,{new:true})
    res.send(repUser)
  }
  catch(err){
    res.send(400).json(err)
  }
}