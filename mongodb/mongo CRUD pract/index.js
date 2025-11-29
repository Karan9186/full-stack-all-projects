const express=require('express')
const app=express();
const user=require("./controller/userController")
const mongoose=require("mongoose")

mainConnection().catch((err)=>console.log(err));
app.use(express.json())
async function mainConnection(){
  await mongoose.connect("mongodb://127.0.0.1:27017/karan")
  console.log("connected")
}

app.post("/products",user.createUser).get("/",user.getAllUser).patch("/products/:id",user.updateUser).put("/products/:id",user.replaceUser).get("/products/:id",user.findOneUser).delete("/products/:id",user.deleteUser)


app.listen(3000)