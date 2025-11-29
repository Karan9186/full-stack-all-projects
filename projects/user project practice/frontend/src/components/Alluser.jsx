import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function Alluser() {
  let [allData, setAllData] = useState([]);
  let [msg, setMsg] = useState("");
  const renderData = async () => {
    const response = await fetch("http://localhost:4000/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    // console.log(result);
    setAllData(result);
  };

  const deleteUser = async (id) => {
    const response = await fetch(`http://localhost:4000/delete/${id}`, {
      method: "DELETE",
    });
    setMsg(
      <div className="alert alert-danger" role="alert">
        data deleted
      </div>
    );
    const result = response.json();
    console.log(result);
    setTimeout(() => {
      renderData();
      setMsg("");
    }, 1000);
  };
  let all = allData.map((v, i) => {
    return (
      <div className="card" style={{ width: "18rem" }} key={i}>
        <div className="card-body">
          <h5 className="card-title">name: {v.name}</h5>
          <p className="card-text">email: {v.email}</p>
          <p className="card-text">pass: {v.pass}</p>
          <div className="d-flex gap-3">
            <Link to={`/update/${v._id}`} className="btn btn-primary">
              update
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => deleteUser(v._id)}
            >
              delete
            </button>
          </div>
        </div>
      </div>
    );
  });
  useEffect(() => {
    renderData();
  }, []);
  return (
    <>
      {msg}
      <div className="d-flex flex-row flex-wrap gap-4 mt-4">{all}</div>
    </>
  );
}

export default Alluser;
