import e from "express";
import { UserController } from "../../controller/user.controller.js";
import {Authentication} from "../../auth/Authentication.js";
const userRoutes = e.Router();

userRoutes.post("/createUser", UserController.createUser);
userRoutes.post("/getUser", UserController.getUser);
userRoutes.post("/login", UserController.loginUser);
userRoutes.post("/auth", Authentication);

export default userRoutes;
