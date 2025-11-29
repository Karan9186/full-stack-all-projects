import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginBar() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  const changeHandling = (e) => {
    setUserData((old) => ({
      ...old,
      [e.target.name]: e.target.value,
    }));
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(userData);

    const result = await fetch("http://localhost:4000/login", {
      method: "post",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(userData),
    });
    const reponse = await result.json();
    console.log(reponse);
    if (reponse.message == "Login successful") {
      localStorage.setItem("token", reponse.token);
      localStorage.setItem("user", JSON.stringify(reponse.user));
      navigate("/home");
    } else {
      alert(reponse.message);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center h-[100vh] bg-green-100">
        <form
          onSubmit={handleLogin}
          action=""
          className="bg-white px-3 py-3 rounded shadow shadow-xl shadow-slate-200"
        >
          <div className="">
            <div className="flex  flex-col">
              <label htmlFor="username">username</label>
              <input
                type="text"
                className="focus:outline-none border border-slate-200 mt-3 mb-2"
                name="username"
                onChange={changeHandling}
              />
            </div>

            <div className="flex  flex-col">
              <label htmlFor="password">password</label>
              <input
                type="text"
                className="focus:outline-none border border-slate-200 mt-3 mb-2"
                name="password"
                onChange={changeHandling}
              />
            </div>
          </div>
          <button className="bg-green-500 text-white px-2 py-1 rounded mt-4 w-full ">
            login
          </button>
        </form>
      </div>
    </>
  );
}
export default LoginBar;
