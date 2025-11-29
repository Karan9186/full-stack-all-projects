import React from "react";
import { blogData } from "./Demo_data";
import { useLocation } from "react-router-dom";
function Blog() {
  let ulocation = useLocation();
  let currentId = ulocation.pathname.split("/")[2];
  let currentData = blogData.filter((v) => v.id == currentId)[0];

  console.log(currentData);
  return (
    <div>
      <h1>{currentData.title}</h1>
      <p>{currentData.content}</p>
    </div>
  );
}

export default Blog;
