import "./App.css";
import "react-toastify/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.css";
import {
  uppercase_letters,
  lowercase_letters,
  symbols,
  numbers,
} from "../Datas";
import { useState } from "react";
function App() {
  let [uc, setUc] = useState(false);
  let [lc, setLc] = useState(false);
  let [nu, setNu] = useState(false);
  let [sy, setSy] = useState(false);
  let [len, setLen] = useState(8);
  let [pass1, setPass1] = useState();
  let char = "";
  let pass = "";
  function generat() {
    if (uc || lc || nu || sy == true) {
      if (uc == true) char += uppercase_letters;
      if (lc == true) char += lowercase_letters;
      if (sy == true) char += symbols;
      if (nu == true) char += numbers;

      for (let i = 0; i < len; i++) {
        pass += char.charAt(Math.floor(Math.random() * char.length));
      }
      setPass1(pass);
    }
  }
  return (
    <>
      <div className="container d-flex align-items-center justify-content-center ">
        <div className="main_cont">
          <h1>Password Generator</h1>

          <div className="child_cont">
            <input type="text" placeholder="Your Password" value={pass1} />
            <div className="number_cont">
              <button>copy</button>
              <input
                type="number"
                value={len}
                onChange={(e) => setLen(e.target.value)}
              />
            </div>

            <div className="mt-3 all_checkbox">
              <p>Uppercase</p>
              <input type="checkbox" checked={uc} onChange={() => setUc(!uc)} />
            </div>

            <div className=" all_checkbox">
              <p>Lowercase</p>
              <input type="checkbox" checked={lc} onChange={() => setLc(!lc)} />
            </div>

            <div className=" all_checkbox">
              <p>Numbers</p>
              <input type="checkbox" checked={nu} onChange={() => setNu(!nu)} />
            </div>

            <div className=" all_checkbox">
              <p>Symbol</p>
              <input type="checkbox" checked={sy} onChange={() => setSy(!sy)} />
            </div>
            <div className="number_cont">
              <button onClick={() => generat()}>Generator</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
