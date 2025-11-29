const mongoose=require('mongoose')
const Schema=mongoose.Schema

const userSchema=new Schema({
  name:{type:String,require:true},
  email:{type:String,require:true,unique:true},
  age:{type:Number},
})

exports.UserMERN=mongoose.model('UserMERN',userSchema)