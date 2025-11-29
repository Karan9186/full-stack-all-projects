import express from "express"
import { UserController } from "../controller/User.controller.js";

const getUserRoute=express.Router()

getUserRoute.get("/get",UserController.getUser)

export default getUserRoute;