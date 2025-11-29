import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const checkAuth = (req, res, next) => {
  const auth = req.headers["authentication"];
  if (!auth) {
    return res.send({ message: "unahorized person", succes: "false" });
  }
  try {
    const decode = jwt.verify(auth, process.env.SCRET_KEY);
    req.user = decode;
    console.log("the user is ", req.user);
    next();
  } catch (e) {
    return res.send({ message: "server error", succes: "false" });
  }
};
