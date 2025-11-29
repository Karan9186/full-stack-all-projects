const mongoose=require('mongoose')
const {Schema}=mongoose;

const demoSchema=new Schema({
  name:String,
  email:String,
  pass:String,
})

exports.demoServer=mongoose.model('demoServer',demoSchema)
