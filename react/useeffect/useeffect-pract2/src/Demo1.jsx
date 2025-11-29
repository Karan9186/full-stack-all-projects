import React, { useEffect } from "react";

function demo({ count }) {
  useEffect(() => {
    alert("i called every render");
    return () => {
      alert("component was deleted");
    };
  }, [count]);
  return (
    <div>
      <h1>this is the demo.jsx</h1>
    </div>
  );
}

export default demo;
