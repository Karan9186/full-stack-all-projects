const mongoose=require("mongoose")
const {Schema}=mongoose

const productSchema=new Schema({
  name:String,
  price:Number,
  description:String,
})

exports.product=mongoose.model("product",productSchema)
