const express=require('express')
const route=express.Router()
const usercon=require('../controller/userController')

route.get("/",usercon.getAllUser).post("/create",usercon.createUser).delete("/delete/:id",usercon.deleteUser).patch("/update/:id",usercon.updateUser).get("/:id",usercon.getSingleUser)

module.exports=route;