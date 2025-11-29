import React, { useContext } from "react";
import Store from "../store/Store";

function Child2() {
  const count = useContext(Store);
  return (
    <div>
      <h1>this is the child 2={count.c}</h1>
      <h1>this is the child name={count.name}</h1>
    </div>
  );
}

export default Child2;
