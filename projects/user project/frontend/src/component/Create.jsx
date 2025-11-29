import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Create() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  let navigate = useNavigate();
  let handleSub = async (e) => {
    e.preventDefault();
    const curUser = {
      name: name,
      email: email,
      age: age,
    };

    const response = await fetch("http://localhost:5000/create", {
      method: "POST",
      body: JSON.stringify(curUser),
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (result.message == "error to create user") {
      console.log(result.err);
      alert("email already exixts");
    } else {
      console.log(result);
      setName("");
      setEmail("");
      setAge("");
      navigate("/all");
    }
  };
  return (
    <div className="d-flex align-items-center justify-content-center mt-5">
      <form onSubmit={handleSub}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            name
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputPassword1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputage1" className="form-label">
            age
          </label>
          <input
            type="number"
            className="form-control"
            id="exampleInputage1"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Create;
