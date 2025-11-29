import { useState } from "react";
import "./content.css";
import { data } from "./json_data";

function Content() {
  let tmp = "";
  let [show, setshow] = useState(false);

  if (show) {
    tmp = (
      <>
        <button onClick={() => setshow(!show)}>hide</button>
        <h3>hello</h3>
      </>
    );
  } else {
    tmp = <button onClick={() => setshow(!show)}>show</button>;
  }
  let [count1, setCount] = useState(1);
  let update = () => {
    setCount(count1 + 1);
  };

  let [con, setCon] = useState(false);
  let [change, setChange] = useState(false);
  let [change1, setChange1] = useState(false);
  let [change2, setchange2] = useState(false);
  return (
    <>
      <div>
        <div className="main_div_con">
          <div className="flex_class">
            <h1>Services</h1>
            <div>{tmp}</div>
            <button onClick={update}>your number {count1}</button>
          </div>
          <div className="details_con1">
            {data.map((v, i) => {
              return <Print_con pitems={v} key={i} />;
            })}
          </div>
        </div>
      </div>
      <div className="main_div_con">
        <h1>this is the heading </h1>
        <button onClick={() => setCon(!con)}>{con ? "hide" : "show"}</button>
        {con ? <h1>hello</h1> : ""}
        <br />
        <br />
        <input type={change ? "text" : "password"} />
        <button onClick={() => setChange(!change)}>
          {change ? "hide" : "show"}
        </button>
        <br />
        <input type={change1 ? "text" : "password"} />
        <button onClick={() => setChange1(!change1)}>change1 button</button>
        <br />
        <input type={change2 ? "text" : "password"} />
        <button onClick={() => setchange2(!change2)}>on change</button>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </>
  );
}

export default Content;
function show_me(demo) {
  alert("this is " + demo + " alrt function");
}

function Print_con({ pitems }) {
  return (
    <div className="for_hover">
      <div className="parent_details">
        <h2>{pitems.title}</h2>
        <p>{pitems.body}</p>
        <button onClick={() => show_me(pitems.title)}>click me</button>
      </div>
    </div>
  );
}
