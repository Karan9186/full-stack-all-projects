const mongoose =require('mongoose')
const {Schema} = mongoose

const userSchema=new Schema({
  name:String,
  email:String,
  pass:String
})

exports.newUserSchema=mongoose.model('newUserSchemaTest',userSchema)