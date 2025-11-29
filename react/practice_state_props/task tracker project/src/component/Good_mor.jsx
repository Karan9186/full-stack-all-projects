import React from "react";
import "./good_mor.css";
function Good_mor() {
  return (
    <div>
      <div className="img_class">
        <img src="src/assets/back_green.png" alt="back image" />
      </div>
      <div className="content">
        <h1>good mornig karan</h1>
        <p>you have 6 task for today</p>

        <div className="inside_content">
          <h6>up next</h6>

          <div className="con01">
            <div className="border"></div>
            <div className="main_content">
              <h6>Lorem, ipsum dolor</h6>
              <h6>Lorem, ipsum </h6>
              <p>11:30AM - 1:00PM</p>
            </div>
          </div>

          <div className="con01">
            <div className="border back_blue"></div>
            <div>
              <h6>Lorem, ipsum dolor</h6>
              <h6>Lorem, ipsum </h6>
              <p>11:30AM - 1:00PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Good_mor;
