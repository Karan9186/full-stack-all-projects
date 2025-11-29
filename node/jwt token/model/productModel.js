const mongoose=require("mongoose")
const {Schema}=mongoose;

const productSchema=new Schema({
  name:{type:String},
  price:{type:Number},
  description:{type:String},
  token:{type:String}
})
module.exports=mongoose.model("product",productSchema);