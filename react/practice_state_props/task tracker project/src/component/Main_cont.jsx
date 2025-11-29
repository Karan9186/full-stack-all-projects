import React from "react";
import "./main_cont.css";
import Dashboard from "./Dashboard";
import Good_mor from "./Good_mor";
import Calender from "./Calender";
function Main_cont() {
  return (
    <div className="main_cont">
      <div className="dashboard">
        <Dashboard />
      </div>

      <div className="welcome_user">
        <Good_mor />
      </div>

      <div className="calender">
        <Calender />
      </div>
    </div>
  );
}

export default Main_cont;
