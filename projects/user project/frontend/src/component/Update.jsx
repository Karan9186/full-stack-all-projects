import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Update() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const { id } = useParams();

  let fetchData = async () => {
    const userFind = await fetch(`http://localhost:5000/${id}`, {
      method: "GET",
    });
    const result = await userFind.json();
    console.log(result);
    setName(result.name);
    setAge(result.age);
    setEmail(result.email);
  };

  useEffect(() => {
    fetchData();
  }, []);

  let handleSub = async (e) => {
    e.preventDefault();
    const currUser = {
      name: name,
      email: email,
      age: age,
    };

    const res = await fetch(`http://localhost:5000/upd/${id}`, {
      method: "PATCH",
      body: JSON.stringify(currUser),
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    console.log(result);
  };
  return (
    <div className="d-flex align-items-center justify-content-center mt-5">
      <form onSubmit={(e) => handleSub(e)}>
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
          Update Now
        </button>
      </form>
    </div>
  );
}

export default Update;
