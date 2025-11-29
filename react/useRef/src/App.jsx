import React, { useRef, useState } from "react";

function App() {
  const user = useRef();
  const pass = useRef();
  const [userData, setUserData] = useState([]);

  let handlingForm = (e) => {
    let currentD = {
      name: user.current.value,
      pass: pass.current.value,
    };
    setUserData((curr) => [...curr, currentD]);

    e.preventDefault();
  };

  let allData = userData.map((v, i) => {
    return (
      <div key={i}>
        <h1>username={v.name}</h1>
        <h1>pass={v.pass}</h1>
      </div>
    );
  });
  return (
    <div>
      <form action="" onSubmit={handlingForm}>
        username
        <input type="text" ref={user} />
        password
        <input type="text" ref={pass} />
        <br />
        <button>save</button>
      </form>
      <h1>the all data</h1>
      {allData}
    </div>
  );
}

export default App;
