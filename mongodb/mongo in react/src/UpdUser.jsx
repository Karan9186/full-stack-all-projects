import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Store } from "./store/Store";
import axios from "axios";
import { ConnectionStates, connection } from "mongoose";

function UpdUser() {
  const [user, setUser] = useState([]);
  let [loader, setLoader] = useState(true);

  const getUser = async () => {
    let url = window.location.href;
    let id = url.split("/")[4];
    const res = await axios.get("http://localhost:3000/user");
    let cuurU = res.data;
    let oldData = cuurU.filter((i) => i._id == id)[0];
    setUser(oldData);
    setLoader(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  let handleChnage = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  let updateUser = (i) => {
    const id = i;
    const getUser = async (user) => {
      const res = await axios.patch(`http://localhost:3000/user/${id}`, user);
      // console.log(res.data);
    };
    getUser(user);
    setUser(user);
    window.location.href = "/";
  };

  return (
    <>
      <div className="add-user-container">
        <h2>Update User</h2>
        {loader == true ? (
          <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <form
            className="add-user-form"
            onSubmit={(e) => {
              e.preventDefault();
              updateUser(user._id);
            }}
          >
            <div className="form-control">
              <label>Name:</label>
              <input
                type="text"
                placeholder="Enter name"
                htmlFor="name"
                value={user.name}
                name="name"
                onChange={handleChnage}
              />
            </div>
            <div className="form-control">
              <label>Email:</label>
              <input
                type="email"
                placeholder="Enter email"
                value={user.email}
                name="email"
                htmlFor="email"
                onChange={handleChnage}
              />
            </div>
            <div className="form-control">
              <label>Password:</label>
              <input
                type="password"
                placeholder="Enter password"
                value={user.pass}
                name="pass"
                htmlFor="pass"
                onChange={handleChnage}
              />
            </div>
            <button type="submit" className="btn-add-user">
              Update User
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export default UpdUser;
