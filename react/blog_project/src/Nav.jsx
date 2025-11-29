import React, { useState } from "react";
import "./nav.css";
import { IoIosCloseCircle, IoMdSearch } from "react-icons/io";
function Nav() {
  let [show, setShow] = useState(false);
  return (
    <div>
      <div className="navbar">
        <div className="name_and_input">
          <h1>Blog</h1>
          <div className="gap_define">
            <IoMdSearch size={"25px"} />
            <input type="text" className="search_box"/>
          </div>
        </div>
        <div className="links">
          <a href="#">HOME</a>
          <a href="#">BLOG</a>
          <a href="#">PODCAST</a>
          <a href="#">ABOUT</a>
          <a href="#">
            <button className="btn_login" onClick={() => setShow(!show)}>
              Login
            </button>
          </a>
        </div>
      </div>

      <div className="popup">
        <div className={`popup_01 ${show == true ? "show_pop" : ""}`}>
          <div className="flex_login_close">
            <h3>Login</h3>
            <button className="btn_close" onClick={() => setShow(!show)}>
              <IoIosCloseCircle size={"20px"}/>
            </button>
          </div>
          <hr />
          <div className="cont_div_login">
            <form action="">
              <input
                type="email"
                placeholder="Enter The Email"
                className="input_btn"
              />
              <input
                type="password"
                placeholder="Enter The Password"
                className="input_btn"
              />
              <input type="submit" value={"Login"} className="submit_btn" />
              <a href="#">You did't have account?</a>
            </form>
          </div>
        </div>
      </div>
      <br /><br />
    </div>
  );
}

export default Nav;
