import e from "express";
import path from "path";
import multer from "multer";
import {
  getAllUser,
  getMessages,
  massageStore,
  printLastMessage,
  uploadFile,
  userGet,
  userLogin,
  userRegistration,
} from "../controller/uesr.controller.js";

// Define the storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define where to save the uploaded file
    cb(null, "uploads/"); // Make sure 'uploads' folder exists in the root directory
  },
  filename: (req, file, cb) => {
    // Define the filename for the uploaded file (e.g., timestamp + original extension)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize multer with the defined storage and additional file validation
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

const route = e.Router();

// Define your routes
route.post("/login", userLogin);
route.post("/register", userRegistration);
route.post("/getuser", userGet);
route.get("/getAll", getAllUser);
route.get("/storeMsg", massageStore);
route.post("/getmsg", getMessages);
route.post("/getlastmsg", printLastMessage);

route.post("/sendfile", upload.single("file"), uploadFile);

export default route;
