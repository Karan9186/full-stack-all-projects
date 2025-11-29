import React, { act, useReducer, useRef } from "react";

function reducerFun(state, action) {
  if (action.type == "add") {
    let currentData = {
      username1: action.payload.username1,
      password1: action.payload.password1,
    };
    state = [...state, currentData];
    return state;
  }
}
function NewComponenet() {
  const username = useRef("");
  const password = useRef("");
  const [state, action] = useReducer(reducerFun, []);
  const handleSub = (e) => {
    const user = username.current.value;
    const pass = password.current.value;
    const payLoad = {
      type: "add",
      payload: { username1: user, password1: pass },
    };
    action(payLoad);
    e.preventDefault();
  };

  const printdata = state.map((v, i) => {
    return (
      <div key={i}>
        <p>username:{v.username1}</p>
        <p>password:{v.password1}</p>
      </div>
    );
  });
  return (
    <div>
      <h1>useReducer</h1>
      <form onSubmit={(e) => handleSub(e)}>
        <p>username</p>
        <input
          type="text"
          ref={username}
          name="username"
          placeholder="Enter your username"
        />
        <p>password</p>
        <input
          type="password"
          name="password"
          ref={password}
          placeholder="Enter your password"
        />
        <br />
        <br />
        <button type="submit">Submit</button>
      </form>
      {printdata}
    </div>
  );
}

export default NewComponenet;
