import React from "react";
import Child1 from "./childs/Child1";
import store from "./store/Store";
function App() {
  let name = "karan";
  let username = "by default";
  const allFiled = {
    Ename: name,
    user: username,
  };
  return (
    <div>
      <store.Provider value={allFiled}>
        <h1>app componnet</h1>
        <Child1 />
      </store.Provider>
    </div>
  );
}

export default App;
