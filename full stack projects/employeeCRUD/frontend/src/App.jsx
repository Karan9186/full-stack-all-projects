import React from "react";
import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Greeting from "./components/Greeting";
import Login from "./components/Login";
import Update from "./components/Update";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Greeting />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upd" element={<Update />} />
      </Routes>
    </>
  );
}

export default App;
