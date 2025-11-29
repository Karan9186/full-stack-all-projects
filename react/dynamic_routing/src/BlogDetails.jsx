import React from "react";
import { useLocation } from "react-router-dom";
import { blogData } from "./assets/datas";
function BlogDetails() {
  let uselocation = useLocation();
  let currentId = uselocation.pathname.split("/")[2];
  let currentData = blogData.filter((v) => v.id == currentId)[0];
  console.log(currentData);
  return (
    <div className="container">
      <h1>{currentData.title}</h1>
      <p>{currentData.content}</p>
    </div>
  );
}

export default BlogDetails;
