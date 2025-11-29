import React, { useEffect, useState } from "react";
import { Link, useAsyncError, useNavigate } from "react-router-dom";

function Alluser() {
  let [allData, setAllData] = useState([]);
  let [loader, setLoadet] = useState(true);
  let [errMsg, setErrMsg] = useState("");
  const navigator = useNavigate();
  const allDatas = async () => {
    const all = await fetch("http://localhost:5000/", {
      method: "GET",
    });
    const result = await all.json();
    setAllData(result);
    setLoadet(false);
  };
  useEffect(() => {
    allDatas();
  }, []);

  const deleteUser = async (id) => {
    const response = await fetch(`http://localhost:5000/delete/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    navigator("/all");
    setErrMsg(
      <h3 className="alert alert-danger" role="alert">
        deleted
      </h3>
    );
    setTimeout(() => {
      allDatas();
      setErrMsg("");
    }, 2000);
  };
  let printData = allData.map((v, i) => {
    return (
      <div className="card" style={{ width: "18rem" }} key={i}>
        <div className="card-body">
          <h5 className="card-title">{v.name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{v.age}</h6>
          <p className="card-text">{v.email}</p>
          <div className="d-flex gap-2">
            <Link to={`/upd/${v._id}`} className="btn btn-primary">
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
  return (
    <>
      {errMsg}
      <br />
      <div
        className={`d-flex flex-wrap gap-3 m-4 ${
          loader ? "d-flex align-items-center justify-content-center " : ""
        }`}
      >
        <br />
        <br />
        {loader == true ? (
          <div>
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only"></span>
            </div>
          </div>
        ) : (
          printData
        )}
      </div>
    </>
  );
}

export default Alluser;
