import React from "react";
import Navbar from "./components/layout/Navbar";
import { Route, Router, Routes } from "react-router-dom";
import Index from "./components/home/Index";
import Footer from "./components/layout/Footer";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { Toaster } from 'react-hot-toast';
import Home from "./components/home/Home";
import ProtectedRoute from "./components/privateroute/ProtectedRoutes";
import ViewAllPdf from "./components/profile/ViewAllPdf";

const App = () => {
  return (
    <>
      <Navbar />
      <br /><br />
      <div style={{background:"linear-gradient(90deg, rgba(255,153,69,0.06214985994397759) 0%, rgba(255,25,0,0.050945378151260545) 0%, rgba(56,134,255,0.10696778711484589) 21%, rgba(255,137,213,0.11537114845938379) 50%, rgba(51,255,18,0.05654761904761907) 72%, rgba(255,101,67,0.03974089635854339) 100%)"}} className="min-h-screen">
        <Routes>
          <Route element={<Index />} path="/" />
          <Route element={<Register />} path="/signup" />
          <Route element={<Login />} path="/signin" />
          <Route element={<ProtectedRoute><Home /></ProtectedRoute> } path="/home" />
          <Route element={<ProtectedRoute><ViewAllPdf /></ProtectedRoute> } path="/your-pdf" />
        </Routes>
        {/* <h1 className="text-3xl font-bold underline">hellow world</h1> */}
      </div>
      <Toaster />
      <Footer/>
    </>
  );
};

export default App;
