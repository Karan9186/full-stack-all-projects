import { useState } from "react";
import "./App.css";
import { tabs } from "./datas";

function App() {
  let [activeContent, setactiveContent] = useState(tabs[0]);
  let [activeTab, setavtiveTab] = useState(0);
  let changedata = (i) => {
    setactiveContent(tabs[i]);
    setavtiveTab(i);
  };
  return (
    <>
      <div className="div_main_container">
        <div>
          <h2>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio,
            vitae?
          </h2>
        </div>

        <div className="second_div">
          <ul>
            {tabs.map((v, i) => {
              return (
                <>
                  <li>
                    <button
                      className={activeTab == i ? "activetab" : ""}
                      onClick={() => changedata(i)}
                    >
                      {v.title}
                    </button>
                  </li>
                </>
              );
            })}
          </ul>
          <h3>{activeContent.description}</h3>
        </div>
      </div>
    </>
  );
}

export default App;
