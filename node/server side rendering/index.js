const express=require('express')
const app=express()
const mongoose=require('mongoose')
const user=require("./controller/serverSideRenderController")
mainConnection().catch((err)=>{console.log("connection error")})
async function mainConnection(){
  await mongoose.connect("mongodb://127.0.0.1:27017/karan")
  console.log("connected");
}

app.use(express.json())
app.use(express.urlencoded())
app.get("/ssr",user.getAllProductSSR)
app.get("/ssrAdd",user.productSSR)
app.post('/demo',user.createDemo)
app.delete('/demo/:id',user.deleteProductSSR)

app.listen(3000)