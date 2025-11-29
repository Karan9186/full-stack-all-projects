import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Document, Page, pdfjs } from "react-pdf";
import { createClient } from "@supabase/supabase-js";
import { getLocalStorage } from "../../../../backend/utils/GlobalLocalstorage";
import { LOCAL_STORAGE } from "../../../../backend/utils/constant";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import '@react-pdf-viewer/core/lib/styles/index.css';
// Set the workerSrc to the correct path

// Use a different version of pdfjs-dist that is available on unpkg
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/+esm`;

// Initialize Supabase client
const supabase = createClient(
  "https://iwncbfitrokxvrrorcfx.supabase.co", // Your Supabase project URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3bmNiZml0cm9reHZycm9yY2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMDM5MzMsImV4cCI6MjA1NTc3OTkzM30.OnF9u6BmzYKQpaoxVEC4iBrIj7CNvDoyS4sBinCeBqo" // Replace with your Supabase anon public key
);

const App = () => {
  const user = getLocalStorage(LOCAL_STORAGE.USER);
  const userDetials = JSON.parse(user);
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Handle file upload
  const uploadPdf = async (file) => {
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("pdfs") // Replace with your bucket name
      .upload(`pdfs/${file.name}`, file);

    if (error) {
      console.log("Error uploading PDF:", error);
      return;
    }

    // Log the returned data to see the structure
    console.log("-=-=-", data.fullPath);
    // Construct the file URL using data.path (full file path in Supabase storage)
    const fileUrl = `https://iwncbfitrokxvrrorcfx.supabase.co/storage/v1/object/public/${data.fullPath}`;
    setPdfUrl(fileUrl);
    console.log("-=-----------", fileUrl);

    // After the upload, store the metadata (filename, description) in Supabase Database
    const response = await supabase
      .from("pdfs") // Replace with your table name
      .insert([
        {
          filename: file.name,
          file_url: data.path, // Store the file path in the database
          description: editingText,
          user_id: userDetials?.userId, // Store the user ID who uploaded the file
        },
      ]);

    // You can log the result here if needed
    console.log("Insert response:", response);
  };

  // Handle file selection or drag-and-drop
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      uploadPdf(acceptedFiles[0]);
    },
    accept: ".pdf",
  });

  return (
    <div className="App">
      <br />
      <br />
      <br />

      <div className="text-center">
        <h3>Welcome, {userDetials?.email}</h3>
        <button onClick={() => supabase.auth.signOut()}>Logout</button>
        <br />
        <br />
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <h2>Drag & Drop a PDF file here or click to select</h2>
        </div>
        {pdfUrl && (
          <div>
            <h3>PDF Preview:</h3>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js`}>
              <Viewer fileUrl={pdfUrl} />
            </Worker>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
