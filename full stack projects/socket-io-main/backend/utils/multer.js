import multer from "multer"; // Set up disk storage
import path from "path";
import express from "express";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the directory where the uploaded files will be stored
    cb(null, "uploads/"); // Folder named 'uploads' in your root directory
  },
  filename: (req, file, cb) => {
    // Specify the file name to store (e.g., original filename with timestamp)
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with timestamp to avoid overwriting
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });
