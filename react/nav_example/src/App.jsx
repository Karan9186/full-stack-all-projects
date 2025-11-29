import { useState } from "react";
import "./app.css";
function App() {
  let [nav, setnav] = useState(false);
let [nNav,nNavset]=useState(false);
  return (
    <>
      <button onClick={() => setnav(!nav)}>
        {nav ? (
          <span className="style_span">&times;</span>
        ) : (
          <span className="style_span">&#9776;</span>
        )}
      </button>
      <div className={`nav_bar ${nav ? "" : "blck_dis"}`}>
        <ul>
          <li>home</li>
          <li>services</li>
          <li>about us</li>
          <li>conatact us</li>
          <li>tab</li>
        </ul>
      </div>
      <br />
      <br />
      <br /> <br />
      <br />
      <br /> <br />
      <br />
      <br /> <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div>
        <button onClick={()=>nNavset(!nNav)}>hello</button>
        <div className={`nav_new ${(nNav)? 'set_nav' : ''}`}>
          <ul>
            <li>home</li>
            <li>home</li>
            <li>home</li>
            <li>home</li>
            <li>home</li>
          </ul>
        </div>
      </div>

      <br /><br /><br /><br /><br /><br />
    </>
  );
}

export default App;
