const express=require('express')
const fs=require('fs')
const mongoose=require('mongoose')
const {Schema}=mongoose;
const userController=require('./controller/user')
const userRouter=express.Router();
const app=express()
const cors=require('cors')

app.use(cors())
console.log("called")
main().catch(err => console.log(err));
app.use(express.json())

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/karan');
  console.log("connected")
}
// app.use('/user',userRouter)

app.post("/user",userController.createUser).get("/user",userController.getAllUser).get("/user/:id",userController.getUser).put("/user/:id",userController.replaceUser).patch("/user/:id",userController.updateUser).delete("/user/:id",userController.deleteUser)

app.listen(3000)
