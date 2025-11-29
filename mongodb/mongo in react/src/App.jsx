import { useState } from "react";
import "./App.css";
import UserList from "./UserList";
import { Store } from "./store/Store";
function App() {
  let [user, setUser] = useState();
  return (
    <>
      <Store.Provider value={{ user, setUser }}>
        <h1 style={{ textAlign: "center" }}>UserList</h1>
        <UserList />
      </Store.Provider>
    </>
  );
}

export default App;
