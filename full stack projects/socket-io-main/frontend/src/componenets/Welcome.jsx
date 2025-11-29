import React from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center justify-center h-[100vh] bg-green-100">
        <div className="bg-white px-4 py-4 shadow shadow-xl shadow-slate-300 rounded">
          <h1 className="font-semibold text-xl mb-4">
            welcome click here to login or register
          </h1>
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => navigate("/login")}
            >
              login here
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              register here
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Welcome;
