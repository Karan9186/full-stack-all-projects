import React, { useEffect, useState } from "react";
import "./app.css";
function App() {
  const [pdata, setPdata] = useState([]);
  const [highLow, setHighLow] = useState("");
  const [ascDesc, setascDesc] = useState("asc");
  let [loader, setLoader] = useState(false);
  const datas = async () => {
    setLoader(true);
    let response = await fetch("http://localhost:4000/product");
    let result = await response.json();
    setPdata(result);
    setLoader(false);
  };
  useEffect(() => {
    datas();
  }, []);

  const changeFun = async () => {
    setLoader(true);
    let response = await fetch(
      `http://localhost:4000/product/?sort=${highLow}&order=${ascDesc}&limit=3`
    );
    let result = await response.json();
    console.log(result);

    setPdata(result);
    setLoader(false);
  };

  const printData = pdata.map((v, i) => {
    return (
      <>
        <div key={i} className="mainDisplayData">
          <h1>{v.pname}</h1>
          <h1>{v.price}</h1>
        </div>
      </>
    );
  });
  useEffect(() => {
    changeFun();
  }, [ascDesc, highLow]);
  return (
    <div>
      <h1>{"this is high =" + highLow + " = and =" + ascDesc}</h1>
      <h1>all data</h1>
      <br />
      <select
        name="sorting"
        id="sort"
        onChange={(e) => setHighLow(e.target.value)}
      >
        <option value=""></option>
        <option value="pname">sort by product name</option>
        <option value="price">sort by price</option>
      </select>
      <select name="sorting" id="" onChange={(e) => setascDesc(e.target.value)}>
        <option value="asc">sort by asceding</option>
        <option value="desc">sort by desending</option>
      </select>
      <br />
      {loader ? <h1>loading</h1> : printData}
    </div>
  );
}

export default App;
