import React, { useContext, useEffect, useState } from "react";
import axios, { Axios } from "axios";
import "./UserList.css";
import { Link } from "react-router-dom";
import { Store } from "./store/Store";
const UserList = () => {
  const { user, setUser } = useContext(Store);
  let [loader, setLoader] = useState(true);

  const getUser = async () => {
    const res = await axios.get("http://localhost:3000/user");
    setUser(res.data);
    setLoader(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  let deleteUser = async (i) => {
    const res = await axios.delete(`http://localhost:3000/user/${i}`);

    setUser(user.filter((id) => id._id != i));
  };
  return (
    <div className="user-list-container">
      <h1>User List</h1>
      <ul className="user-list">
        {loader == true ? (
          <center>
            <div className="spinner-border text-success" role="status">
              <span className="sr-only"></span>
            </div>
          </center>
        ) : (
          user.map((user, i) => (
            <li key={i} className="user-item">
              <div className="user-details">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
                <div className="user-email">{user.pass}</div>
                <button
                  onClick={() => deleteUser(user._id)}
                  style={{
                    backgroundColor: "red",
                    border: "none",
                    padding: "3px 20px",
                    color: "white",
                  }}
                >
                  delete
                </button>
                <button
                  style={{
                    backgroundColor: "green",
                    border: "none",
                    padding: "3px 20px",
                    marginLeft: "10px",
                  }}
                >
                  <Link
                    to={`upd/${user._id}`}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    update User
                  </Link>
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link to="add">add User</Link>
      </div>
    </div>
  );
};

export default UserList;
