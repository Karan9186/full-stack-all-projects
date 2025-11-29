import * as React from "react";
import LeftBar from "./componenets/LeftBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "./componenets/Welcome";
import LoginBar from "./componenets/Login";
import RegisterBar from "./componenets/Register";
import HomePage from "./componenets/HomePage";
import FileUpload from "./componenets/FileUpload";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<LoginBar />} />
          <Route path="/register" element={<RegisterBar />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/file" element={<FileUpload />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
