const express=require('express')

const server=express();

server.get('/',(req,res)=>{
  res.json({type:"get"});
})
server.post('/',(req,res)=>{
  res.json({type:"post"});
})
server.patch('/',(req,res)=>{
  res.json({type:"patch"});
})
server.delete('/',(req,res)=>{
  res.json({type:"delete"});
})
server.put('/',(req,res)=>{
  res.json({type:"put"});
})




server.listen(3000)