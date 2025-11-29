import React from "react";
import "./dashboard.css";
import { FaRegMessage } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";
import { CiViewList } from "react-icons/ci";
import { LuCalendarDays } from "react-icons/lu";
function Dashboard() {
  return (
    <div className="main_dashboard">
      <a href="/" className="">
        <div className="d-flex gap-3  activ">
          <IoHomeOutline size={"23px"} className="icons" />
          <p>dashboard</p>
        </div>
      </a>

      <a href="">
        <div className="d-flex gap-3 ">
          <CiViewList size={"25px"} className="icons" />
          <p>list</p>
        </div>
      </a>

      <a href="">
        <div className="d-flex gap-3 ">
          <LuCalendarDays size={"23px"} className="icons" />
          <p>calender</p>
        </div>
      </a>

      <a href="">
        <div className="d-flex gap-3 ">
          <FaRegMessage size={"23px"} className="icons" />
          <p>message</p>
        </div>
      </a>
    </div>
  );
}

export default Dashboard;
