"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import Particles from "@/components/magicui/particles";

function Herosec() {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");
  const childImg = "./child_food.jpg";
  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

  return (
    <>
      <div className="relative flex h-[100vh] w-full items-center justify-center overflow-hidden rounded-lg bg-background ">
        <div style={{ zIndex: 10 }} className=" w-[50%] px-20">
          <GradualSpacing
            text="Welcome to the foodie cubs"
            className=" bg-gradient-to-b from-black to-gray-600/80 bg-clip-text text-4xl font-semibold leading-none text-transparent "
          />
          <br />
          <GradualSpacing
            className="text-4xl font-bold tracking-[-0.1em]  text-black "
            text="Gradual Spacing"
          />
          <br />
          <button className="text-white text-xl font-semibold hover:bg-yellow-300 bg-yellow-400 px-5 py-1 rounded">
            Explore Now
          </button>
        </div>
        <div className="w-[50%] flex justify-center">
          <img src={childImg} alt="" className=""/>
        </div>
      </div>
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </>
  );
}

export default Herosec;
