import Employee from "../model/emp.model.js";
import bcyrpt from "bcrypt";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.send({ message: "required filed", succes: false });
    }
    const user = await Employee.findOne({ email });
    if (user) {
      return res.send({ message: "user already exixts", succse: false });
    }
    const hashedPass = await bcyrpt.hash(password, 10);
    await Employee.create({
      name: name,
      email: email,
      password: hashedPass,
    });

    res.send({ message: "use registerd", succes: true });
  } catch (e) {
    res.send({ message: "error to register", succes: false });
    console.log(e);
  }
};

export const loginEmp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.send({ message: "required filed", succes: false });
    }
    const user = await Employee.findOne({ email });
    if (!user) {
      return res.send({ message: "user not found", succes: false });
    }
    const hashToNormal = await bcyrpt.compare(password, user.password);
    if (!hashToNormal) {
      return res.send({ message: "password is incorrect", succes: false });
    }
    const tokenData = user.email;
    const token = await jwt.sign(tokenData, process.env.SCRET_KEY);
    res.send({ message: "user logined", token: token, succes: true });
  } catch (e) {
    console.log(e);
    res.send({ message: "user not logined", succes: false });
  }
};

export const accesData = (req, res) => {
  try {
    res.send({ message: "accesed" });
  } catch (e) {
    console.log(e);
    res.send({ message: "not accesd" });
  }
};

export const updateEmpPatch = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isExixt = await Employee.findOne({ email });
    // if (isExixt) {
    //   res.send({ message: "email is exist", succses: false });
    // }
    const hashToNormal = await bcyrpt.compare(password, isExixt.password);
    if (hashToNormal) {
      res.send({ message: "password is already same", succses: false });
    }
    const hashedPass = await bcyrpt.hash(password, 10);
    const user = {
      name: name,
      email: email,
      passowrd: hashedPass,
    };
    const emp = await Employee.findOneAndUpdate({ email: email }, user, {
      new: true,
    });
    res.send({ message: "user updated" });
  } catch (e) {
    console.log(e);
    res.send({ message: "not updaed" });
  }
};
