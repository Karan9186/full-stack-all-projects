import e from "express";
import {
  accesData,
  loginEmp,
  register,
  updateEmpPatch,
} from "../controller/emp.controller.js";
import { checkAuth } from "../middleware/auth.js";
const router = e.Router();

router.route("/register").post(register);
router.route("/login").post(loginEmp);
router.route("/get").get(checkAuth, accesData);
router.route("/upd").patch(updateEmpPatch);

export default router;
