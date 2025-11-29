const express=require('express');
const server=express();

//build in middle ware for postman API (req.body.password)(server.post) 
// server.use(express.json())
// end

server.use(express.static("public"))
// custome middleware
const auth=(req,res,next)=>{
  if(req.query.password=="123"){
    res.send("you are authorized");
    next();
  }
  else{
    res.sendStatus(401);
  }
}


server.use((req,res,next)=>{
  console.log(req.get('User-Agent'),req.method,req.ip,new Date(),req.hostname);
  next();
})


server.get('/',auth,(req,res)=>{
  res.send("helo wol")
  
})

server.listen(3000)