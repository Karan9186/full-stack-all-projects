import React, { useContext, useState } from "react";
import Text from "../component/Text";
import { ShowContext } from "../store/ContextList";
function Demo_text2() {
  let conut = useContext(ShowContext);
  let [c, setC] = useState(conut);
  let countUp = () => {
    c = conut++;
    setC(c);
  };
  return (
    <div>
      <h1>this is Demo_text2</h1>
      <p>{c}</p>
      <button onClick={countUp}>click to update</button>
      <Text />
    </div>
  );
}

export default Demo_text2;
