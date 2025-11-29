import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Hero_section from "./Hero_section.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import SectionJourny from "./SectionJourny.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Hero_section />
    <SectionJourny />
  </React.StrictMode>
);
