import React from "react";
import { BiExport } from "react-icons/bi";
import { IoMdTime } from "react-icons/io";
import "./header.css";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineNotifications,
} from "react-icons/md";
import { CiSearch } from "react-icons/ci";

function Header() {
  return (
    <div id="header">
      <div className="header01">
        <img src="src/assets/react.svg" alt="logo" />
        <h2>timeyfi</h2>
      </div>

      <div className="header02">
        <CiSearch size={"23px"} />
        <input type="text" className="man_input" placeholder="Search Here" />
        <div className="d-flex summary_class">
          <BiExport size={"23px"} />
          <p>export summary</p>
        </div>
        <MdOutlineKeyboardArrowDown size={"23px"} />
        <IoMdTime size={"23px"} />
        <MdOutlineNotifications size={"23px"} />
        <img src="src/assets/react.svg" alt="profile" />
      </div>
    </div>
  );
}

export default Header;
