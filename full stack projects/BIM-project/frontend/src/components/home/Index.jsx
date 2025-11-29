import React from "react";
import heroImg from "/public/herosec.png";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const navigate=useNavigate()
  return (
    <>
      <div className="w-[100%] flex items-center gap-10">
        <div className="w-1/2">
          <div className="w-3/5 float-right">
            <h1 className="text-3xl font-bold text-red-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam,
              architecto.
            </h1>
            <button className="mt-7 border-1 border-red-300 bg-slate-300 shadow-md shadow-red-300 text-black hover:bg-slate-500 hover:text-white hover:shadow-sm  duration-100 ease-in font-semibold p-1 px-7 rounded" onClick={()=>navigate("/signin")}>Get Start</button>
          </div>
        </div>
        <img src={heroImg} alt="" className="w-1/2" />
      </div>
    </>
  );
};

export default Index;
