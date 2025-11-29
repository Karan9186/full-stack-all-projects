import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import BlogDetails  from "./BlogDetails";
import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";

let allRout = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        this is demo <Link to="blog">all routing</Link>
      </div>
    ),
  },
  {
    path: "blog",
    element: <App />,
  },
  {
    path: "blog/:id",
    element: <BlogDetails />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={allRout} />
  </React.StrictMode>
);
