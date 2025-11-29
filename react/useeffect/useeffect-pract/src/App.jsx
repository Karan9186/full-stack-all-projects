import { useEffect } from "react";
import "./App.css";
import { useState } from "react";
import Demo from "./Demo";

function App() {
  let [show, setShow] = useState(false);
  let d = new Date();
  let cD = d.toString();
  let [date, setdate] = useState(cD);
  useEffect(() => {
    let DateInt = setInterval(() => {
      setdate(new Date().toString());
    }, 1000);
    return () => {
      clearInterval(DateInt);
    };
  }, []);
  return (
    <>
      <div className={`notshow ${show ? "showd" : ""}`}>
        <Demo />
      </div>
      <button onClick={() => setShow(!show)}>goto next</button>
      <h1>heyy this is the App component</h1>
      <p>{date}</p>
      <br />
      <br />
    </>
  );
}

export default App;
