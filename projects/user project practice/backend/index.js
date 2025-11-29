const express = require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv=require('dotenv')
const cors=require('cors')
const allroute=require('./routes/userRoutes')
app.use(express.json())
dotenv.config()
app.use(cors())

async function mainCon(){
  await mongoose.connect(process.env.MONGODB_CON);
  console.log("connected");
}
mainCon().catch((err)=>console.log(err))

app.use(allroute)

app.listen(process.env.PORT)