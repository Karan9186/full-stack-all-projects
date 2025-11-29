import mongoose from "mongoose";


export const connection=async()=>{
  try{
    await mongoose.connect(process.env.URL)
  }catch(err){
    console.log(err)
  }
}