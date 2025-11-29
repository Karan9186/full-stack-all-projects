import express from "express"

export class UserController{
  static getUser=async(req,res)=>{
    res.send("working")
  }
}