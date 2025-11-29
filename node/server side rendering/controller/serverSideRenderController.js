const mongoose=require('mongoose')
const NewDemoServerSchema=require("../model/serverSideRenderMode")
const schemDemo=NewDemoServerSchema.demoServer
const path=require('path')
const ejs=require('ejs')
exports.createDemo=(req,res)=>{
  const User=schemDemo(req.body);
  // User.name='karan';
  // User.email='karan@gmail.com';
  // User.pass='karan123';
  User.save()
    .then((doc)=>{
      res.send(doc);
      console.log("user created")
    })
    .catch((err)=>{
      res.status(400).send({message:"error while creating user"})
    })
}

exports.deleteProductSSR=async(req,res)=>{
  const id=req.params.id;
  const newPrd=await schemDemo.findOneAndDelete({_id:id},{new:true});
  res.send(newPrd);
}
exports.getAllProductSSR=async(req,res)=>{
  const allProduct=await schemDemo.find();
    ejs.renderFile(path.resolve(__dirname,'../serverSideRender/index.ejs'),{allProduct},function(err,str){
      console.log(str);
      res.send(str);
    })
}

exports.productSSR=async(req,res)=>{
  ejs.renderFile(path.resolve(__dirname,'../serverSideRender/formCreateProduct.ejs'),function(err,str){
    console.log(str);
    res.send(str);
  })
}