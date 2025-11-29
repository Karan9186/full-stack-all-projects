import mongoose from "mongoose";

const storeSchema=mongoose.Schema({
  name:String,
  lat:String,
  long:String,
  radius:String,
})

storeSchema.index({location:"2dsphere"})
export const Store=mongoose.model("store",storeSchema)
