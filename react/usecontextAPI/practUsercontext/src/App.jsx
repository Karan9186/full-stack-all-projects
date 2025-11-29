import React, { useState } from "react";
import Store from "./store/Store";
import Child from "./component/Child";
function App() {
  let [count, setcount] = useState(0);
  let setVal = {
    c: count,
    name: "karan",
  };
  return (
    <>
      <Store.Provider value={setVal}>
        <div>
          <h1>this is the main conponent {setVal.c}</h1>
          <Child />
          <button onClick={() => setcount(count + 1)}>click me</button>
        </div>
      </Store.Provider>
    </>
  );
}

export default App;
