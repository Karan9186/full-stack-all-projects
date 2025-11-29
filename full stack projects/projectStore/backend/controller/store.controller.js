import { Store } from "../model/store.schema.js"

export class StoreController{
  static SaveStore=async(req,res)=>{
    try{
      const {name,radius,lat,long}=req.body
      if(!name || !radius || !lat || !long){
        return res.send({message:"something is missing"})
      }
      const store=new Store({name,radius,lat,long})
      const saved=await store.save()
      return res.send("saved succesfully",saved)
    }catch(err){
      console.log(err)
    }
  }
}