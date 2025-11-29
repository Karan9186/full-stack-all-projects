const mongoose=require('mongoose');
const {Schema}=mongoose;

const user =new Schema({
  name:{type:String,require:true},
  email:{type:String,require:true,unique:true},
  pass:{type:String,require:true},
})

exports.newcolluser=mongoose.model('newcolluser',user)