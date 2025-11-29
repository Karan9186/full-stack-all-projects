import { act, useReducer } from "react";
import "./App.css";
import { useRef } from "react";

let methodRe = (state, action) => {
  if (action.type == "add_item") {
    let curentData = {
      user: action.payload.user,
      pass: action.payload.pass,
    };
    state = [...state, curentData];
    return state;
  }
};
function App() {
  let userName = useRef();
  let passWord = useRef();
  let [state, action] = useReducer(methodRe, []);
  let handingDatas = (e) => {
    let user = userName.current.value;
    let pass = passWord.current.value;
    let actionNeed = {
      type: "add_item",
      payload: {
        user: user,
        pass: pass,
      },
    };
    action(actionNeed);
    e.preventDefault();
  };
  let allData = state.map((v, i) => {
    return (
      <div key={i}>
        <h3>userName:{v.user}</h3>
        <h3>password:{v.pass}</h3>
      </div>
    );
  });
  return (
    <>
      <form action="" onSubmit={handingDatas}>
        username
        <input type="text" ref={userName} />
        password
        <input type="text" ref={passWord} />
        <br />
        <input type="submit" />
      </form>
      <h1>all data from usereducer</h1>
      {allData}
    </>
  );
}

export default App;
