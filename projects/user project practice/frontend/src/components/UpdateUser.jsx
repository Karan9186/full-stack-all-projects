import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
function UpdateUser() {
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [pass, setPass] = useState("");
  const { id } = useParams();
  let naviagate = useNavigate();

  const renderUpdData = async () => {
    const response = await fetch(`http://localhost:4000/${id}`, {
      method: "GET",
    });
    const result = await response.json();
    setName(result.name);
    setEmail(result.email);
    setPass(result.pass);
  };

  useEffect(() => {
    renderUpdData();
  }, []);

  const handleSub = async (e) => {
    e.preventDefault();
    const updatedData = {
      name: name,
      email: email,
      pass: pass,
    };
    const response = await fetch(`http://localhost:4000/update/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedData),
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    if (result.message == "user updated") {
      naviagate("/alluser");
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

export default UpdateUser;
