const express= require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const app=express()
const cors=require('cors')
const route=require('../backend/routes/userRoutes')
dotenv.config()
app.use(express.json());

app.use(cors())
async function mainConnect(){
  
    await mongoose.connect(process.env.URI)
    console.log("connected mongoDB");
} 

mainConnect().catch((err)=>console.log("error while connecting MongoDB"))

app.use(route)

app.listen(process.env.PORT)