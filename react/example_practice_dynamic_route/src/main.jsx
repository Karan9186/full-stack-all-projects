import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Blog from "./Blog.jsx";
import Error from "./Error.jsx";

let allRoute = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "blog/:id",
    element: <Blog />,
  },
  {
    path: "*",
    element: <Error />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={allRoute} />
  </React.StrictMode>
);
