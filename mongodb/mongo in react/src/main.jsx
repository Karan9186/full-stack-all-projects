import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AddUser from "./AddUser.jsx";
import { Store } from "./store/Store.jsx";
import UpdUser from "./UpdUser.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
let allRoute = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "add",
    element: <AddUser />,
  },
  {
    path: "upd/:id",
    element: <UpdUser />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <RouterProvider router={allRoute} />
  // {/* </React.StrictMode> */}
);
