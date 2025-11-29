import React, { useState, useEffect } from "react";
import "./AddUser.css"; // Assuming this path is correct
import axios, { Axios } from "axios";
import { connection } from "mongoose";

const AddUser = () => {
  const [allUser, setAllUser] = useState({});

  let handleChnage = (e) => {
    setAllUser({ ...allUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(allUser);

    const getUser = async (allUser) => {
      const res = await axios.post("http://localhost:3000/user", allUser);
      console.log(res.data);
      window.location.href = "/";
    };

    getUser(allUser);
  };

  return (
    <div className="add-user-container">
      <h2>Add User</h2>
      <form onSubmit={handleSubmit} className="add-user-form">
        <div className="form-control">
          <label>Name:</label>
          <input
            type="text"
            placeholder="Enter name"
            htmlFor="name"
            // value={name}
            name="name"
            onChange={handleChnage}
          />
        </div>
        <div className="form-control">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter email"
            // value={email}
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
            // value={password}
            name="pass"
            htmlFor="pass"
            onChange={handleChnage}
          />
        </div>
        <button type="submit" className="btn-add-user">
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
