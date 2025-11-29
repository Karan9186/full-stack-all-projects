import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function Create() {
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [pass, setPass] = useState("");
  let navigate = useNavigate();
  const handleSub = async (e) => {
    e.preventDefault();
    const currUser = {
      name: name,
      email: email,
      pass: pass,
    };

    const response = await fetch("http://localhost:4000/create", {
      method: "POST",
      body: JSON.stringify(currUser),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (result.message == "error to create user") {
      console.log("error to create user");
    } else {
      setName("");
      setEmail("");
      setPass("");
      navigate("/alluser");
    }
  };
  return (
    <div className="d-flex align-items-center justify-content-center mt-5">
      <form onSubmit={(e) => handleSub(e)}>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">name</label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputemail1">email</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputemail1"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>
        <br />
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Create;
