import mongoose from "mongoose";

const empSchme = mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
});

const Employee = mongoose.model("emp", empSchme);

export default Employee;
