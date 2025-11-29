import React, { useContext } from "react";
import { NewStore } from "./Store";

function New2() {
  const valueOfA = useContext(NewStore);

  return (
    <div>
      <h1>this is the New2 jsx file </h1>
      <p>the A={valueOfA}</p>
    </div>
  );
}

export default New2;
