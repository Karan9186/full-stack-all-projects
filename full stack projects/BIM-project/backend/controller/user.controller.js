import { supabase } from "../model/supabase.js";
import { validateRequiredFields } from "../utils/GlobalFieldValidator.js";
import { sendResponse } from "../utils/GlobalResponseSender.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export class UserController {
  static createUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const requiredFields = ["name", "email", "password"];

      const validationError = validateRequiredFields(requiredFields, req, res);
      if (validationError) return validationError;

      const hashedPassword = await bcrypt.hash(password, 10);
      const response = await supabase
        .from("users")
        .insert({ name, email, password: hashedPassword });
      if (response?.status == 201) {
        return sendResponse(res, 201, "User created successfully", []);
      } else {
        return sendResponse(res, 400, "Failed to create user", []);
      }
    } catch (err) {
      console.log(err);
      return sendResponse(res, 500, `error ${err}`, []);
    }
  };

  static getUser = async (req, res) => {
    try {
      const { userId } = req.body;
      const validationError = validateRequiredFields(["userId"], req, res);
      if (validationError) return validationError;
      const response = await supabase.from("users").select().eq("id", userId);

      return sendResponse(res, 200, "User found successfully", response.data);
    } catch (err) {
      console.log(err);
      return sendResponse(res, 500, `error ${err}`, []);
    }
  };

  static loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const requiredFields = ["email", "password"];
  
      const validationError = validateRequiredFields(requiredFields, req, res);
      if (validationError) return validationError;
  
      // Fetch the user from Supabase by email
      const { data, error } = await supabase
        .from("users")
        .select("*")  // Only select the password to optimize query
        .eq("email", email)
        .single();  // Assuming the email is unique, use .single() to get the single user result
  
      if (error || !data) {
        // If there's an error or no data is returned, respond with an error
        return sendResponse(res, 404, "User not found", []);
      }
  
      const { password: hashedPassword } = data;  // Extract the hashed password from the result
  
      // Check if the password is valid by comparing the hash
      const comparedPass = await bcrypt.compare(password, hashedPassword);
  
      if (comparedPass) {
        const token=jwt.sign(data?.email,process.env.SECRET)
        const updatedData={
          userId:data?.id,
          email:data?.email,
          token
        }
        return sendResponse(res, 200, "User logged in successfully", updatedData);
      } else {
        return sendResponse(res, 400, "Invalid credentials", []);
      }
    } catch (err) {
      console.log(err);
      return sendResponse(res, 500, `Error: ${err.message}`, []);
    }
  };
  
}
