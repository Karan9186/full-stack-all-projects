import React, { useContext } from "react";
import store from "../store/Store";

function Child3() {
  const all = useContext(store);
  return (
    <div>
      <h1>
        child 3 componet {all.Ename} anf {all.user}
      </h1>
    </div>
  );
}

export default Child3;
