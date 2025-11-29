import React, { useContext } from "react";
import Store from "../store/Store";
import Child2 from "./Child2";

function Child() {
  const count = useContext(Store);
  return (
    <div>
      <h1>this is child component={count.c}</h1>
      <Child2 />
    </div>
  );
}

export default Child;
