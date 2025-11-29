import React from "react";
import "./hero.css";
function Hero_section() {
  return (
    <div className="mainHerosection gap-4">
    
      <div className="forRightPart w-50">
        <h1 className="mt-5 ">With a Growth Mindset</h1>
        <button className="mb-5 ps-5 pe-5 mt-3 btnHero mainHoverBtn">get a free consultation</button>

        <div className="d-flex gap-3">
          <div className="mainLeftHero">
            <h3>Strategies for Success</h3>
            <p>
              I'm a paragraph. Click here to add your own text and edit me. I’m
              a great place for you to tell a story and let your users know a
              little more about you.
            </p>
            <button className="ps-3 pe-3 mainHoverBtn">read more</button>
          </div>

          <div className="mainLeftHero">
            <h3>Strategies for Success</h3>
            <p>
              I'm a paragraph. Click here to add your own text and edit me. I’m
              a great place for you to tell a story and let your users know a
              little more about you.
            </p>
            <button className="ps-3 pe-3 mainHoverBtn">read more</button>
          </div>
        </div>
      </div>

      <div className="forImg">
        <img src="public/imgs/hero-Photoroom.png" className="mainHoverBtn" alt="" />
      </div>
    </div>
  );
}

export default Hero_section;
