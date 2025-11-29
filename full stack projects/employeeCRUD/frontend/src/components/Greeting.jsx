import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Greeting() {
  const [upd, setUpd] = useState(false);
  const navigate = useNavigate();
  const loadData = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:300/api/user/get", {
      method: "GET",
      headers: {
        authentication: token,
      },
    });
    console.log(token);

    const result = await response.json();
    if (result.message == "accesed") {
      setUpd(true);
    } else {
      navigate("/login");
    }
  };
  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  useEffect(() => {
    loadData();
  }, [logOut]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-[40px]">
      <h1>hello welcome to the our website</h1>
      <button
        onClick={() => navigate("/upd")}
        className="bg-red-200 p-3 rounded-xl text-[20px]"
      >
        update
      </button>
      <br />

      {upd == true ? (
        <button
          onClick={logOut}
          className="bg-red-200 p-3 rounded-xl text-[20px]"
        >
          logout
        </button>
      ) : (
        <button className="bg-red-200 p-3 rounded-xl text-[20px]">Login</button>
      )}
    </div>
  );
}

export default Greeting;
