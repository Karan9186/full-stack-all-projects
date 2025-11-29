const express=require('express')
const fs=require('fs')
const app=express();
app.use(express.json())
let data=JSON.parse(fs.readFileSync('data.json','utf-8'))
let product=data.products

app.get("/prd",(req,res)=>{
  res.send(product)
})

// read get
app.get("/prd/:id",(req,res)=>{
    // console.log(req.url.split('/')[2])
    let id=req.params.id;
    let prd=product.find(p=>p.id===(+id))
  res.json(prd)
})

// create post
app.post("/prd",(req,res)=>{
  console.log(req.body)
  // product=[...product,req.body] //also this works
  product.push(req.body)
  res.send(product)
})

// update put
app.put("/prd/:id",(req,res)=>{
  let id=req.params.id;
  let inx=product.findIndex(p=>p.id===(+id))
  product.splice(inx,1,{...req.body,id:id})
  res.status(201).json()
})

// update with patch
app.patch("/prd/:id",(req,res)=>{
  let id=+req.params.id;
  let inx=product.findIndex(p=>p.id===id)
  const currPrd=product[inx]
  product.splice(inx,1,{...currPrd,...req.body})
  res.status(201).json();
})

// delete
app.delete("/prd/:id",(req,res)=>{
  let id=+req.params.id;
  let inx=product.findIndex(p=>p.id===id)
  product.splice(inx,1)
  res.status(201).json();
  
})

app.listen(3000)