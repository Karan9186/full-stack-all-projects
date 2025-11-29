const mongoose=require('mongoose')
const Schema=mongoose.Schema

const UserSchema=new Schema({
  name:String,
  email:String,
  pass:String,
  token:{ type: String, required: true }
})

exports.newUserCollection=mongoose.model('newUserCollection',UserSchema);